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

// ShipX dla usług kurierskich (C2C) wymaga first_name/last_name osobno — samo "name" nie wystarcza,
// oferta zostaje odrzucona jako "unavailable" (receiver_first_name_required itp.).
function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { first_name: parts[0] ?? fullName, last_name: parts.slice(1).join(" ") || parts[0] || fullName };
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
      ...splitName(order.customer_name ?? ""),
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
    // Gabaryt A (najmniejsza skrytka paczkomatowa): 8x38x64 cm.
    parcels: [{ dimensions: { length: 380, width: 640, height: 80, unit: "mm" }, weight: { amount: 0.5, unit: "kg" } }],
    // inpost_courier_standard wymaga podpisanej umowy B2B z InPost — konta bez umowy
    // (prepaid) używają zamiast tego usługi C2C.
    service: isPaczkomat ? "inpost_locker_standard" : "inpost_courier_c2c",
    custom_attributes: {
      target_point: order.inpost_locker || undefined,
      // Nadanie samodzielnie w dowolnym Paczkomacie — nie czekamy na odbiór przez kuriera.
      sending_method: "parcel_locker",
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
  if (!res.ok) {
    // InPost przy błędach 422 zwraca message ogólnikowe + details z konkretnymi polami — pokaż oba.
    const detailsText = data.details
      ? Object.entries(data.details).map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`).join(" | ")
      : "";
    const fullMessage = [data.message ?? "Błąd InPost API", detailsText].filter(Boolean).join(" — ");
    return NextResponse.json({ error: fullMessage, detail: data }, { status: 502 });
  }

  const shipmentId = String(data.id ?? "");

  // ShipX jest asynchroniczne — przy tworzeniu tracking_number zwykle jeszcze nie istnieje
  // (status "created"/"offers_prepared"). Dopóki go nie ma, nie oznaczaj "wysłane" i nie wysyłaj
  // klientowi fałszywego numeru — czekamy aż /api/admin/label/check potwierdzi prawdziwy tracking.
  if (data.tracking_number) {
    await sql`UPDATE orders SET tracking_number = ${data.tracking_number}, shipment_id = ${shipmentId}, status = 'shipped', updated_at = NOW() WHERE id = ${order_id}`;

    if (order.customer_email) {
      const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      await fetch(`${base}/api/email/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: order.customer_email,
          firstName: (order.customer_name ?? "Kliencie").split(" ")[0],
          orderNumber: order.order_number,
          trackingNumber: data.tracking_number,
          deliveryMethod: order.delivery_method,
        }),
      }).catch(e => console.error("Tracking email error:", e));
    }
  } else {
    await sql`UPDATE orders SET shipment_id = ${shipmentId}, updated_at = NOW() WHERE id = ${order_id}`;
  }

  return NextResponse.json({
    ok: true,
    tracking_number: data.tracking_number ?? null,
    pending: !data.tracking_number,
    shipment_id: shipmentId,
    shipment_status: data.status,
    shipment: data,
  });
}
