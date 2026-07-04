import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

// Rozdziela "Ulica 12/3" na ulicę i numer domu/mieszkania — ShipX wymaga tych pól osobno dla kuriera.
function splitAddress(addressLine1: string) {
  const match = addressLine1.trim().match(/^(.*?)\s+(\d+[a-zA-Z]?(?:\/\d+[a-zA-Z]?)?)$/);
  if (match) return { street: match[1].trim(), building_number: match[2].trim() };
  return { street: addressLine1.trim(), building_number: "1" };
}

export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id } = await req.json();
  const sql = getDb();
  const [order] = await sql`SELECT * FROM orders WHERE id = ${order_id}`;
  if (!order) return NextResponse.json({ error: "Brak zamówienia" }, { status: 404 });

  const token = process.env.INPOST_SHIPX_TOKEN;
  const orgId = process.env.INPOST_ORG_ID ?? "79889";
  if (!token) return NextResponse.json({ error: "Brak INPOST_SHIPX_TOKEN" }, { status: 500 });

  const isPaczkomat = order.delivery_method === "inpost";

  if (!isPaczkomat && (!order.address_line1 || !order.city || !order.postal_code)) {
    return NextResponse.json({ error: "Brak pełnego adresu dostawy — nie można utworzyć etykiety kuriera" }, { status: 400 });
  }

  const payload = {
    receiver: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone ?? "",
      ...(isPaczkomat ? {} : {
        address: {
          ...splitAddress(order.address_line1 ?? ""),
          city: order.city ?? "",
          post_code: order.postal_code ?? "",
          country_code: "PL",
        },
      }),
    },
    parcels: [{ dimensions: { length: 380, width: 640, height: 410, unit: "mm" }, weight: { amount: 500, unit: "g" } }],
    // inpost_courier_standard wymaga podpisanej umowy B2B z InPost — konta bez umowy
    // (prepaid) używają zamiast tego usługi C2C.
    service: isPaczkomat ? "inpost_locker_standard" : "inpost_courier_c2c",
    custom_attributes: {
      target_point: order.inpost_locker || undefined,
      sending_method: "dispatch_order",
    },
    reference: order.order_number,
    comments: `GoodStim zamówienie ${order.order_number}`,
  };

  const res = await fetch(
    `https://api-shipx-pl.easypack24.net/v1/organizations/${orgId}/shipments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message ?? "Błąd InPost API", detail: data }, { status: 502 });

  const tracking = data.tracking_number ?? data.id;
  const shipmentId = String(data.id ?? "");
  await sql`UPDATE orders SET tracking_number = ${tracking}, shipment_id = ${shipmentId}, status = 'shipped', updated_at = NOW() WHERE id = ${order_id}`;

  // Wyślij email z numerem śledzenia do klienta
  if (order.customer_email) {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    await fetch(`${base}/api/email/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: order.customer_email,
        firstName: (order.customer_name ?? "Kliencie").split(" ")[0],
        orderNumber: order.order_number,
        trackingNumber: tracking,
        deliveryMethod: order.delivery_method,
      }),
    }).catch(e => console.error("Tracking email error:", e));
  }

  return NextResponse.json({ ok: true, tracking_number: tracking, shipment_id: shipmentId, shipment: data });
}
