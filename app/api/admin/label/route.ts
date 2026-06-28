import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
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

  const payload = {
    receiver: {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone ?? "",
    },
    parcels: [{ dimensions: { length: 380, width: 640, height: 410, unit: "mm" }, weight: { amount: 500, unit: "g" } }],
    service: order.delivery_method === "inpost" ? "inpost_locker_standard" : "inpost_courier_standard",
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
  await sql`UPDATE orders SET tracking_number = ${tracking}, status = 'shipped', updated_at = NOW() WHERE id = ${order_id}`;

  return NextResponse.json({ ok: true, tracking_number: tracking, shipment: data });
}
