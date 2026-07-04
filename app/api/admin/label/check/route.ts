import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

// Sprawdza aktualny status wcześniej utworzonej przesyłki ShipX (asynchroniczne potwierdzenie
// oferty i przydzielenie prawdziwego numeru śledzenia) i dokańcza flow jeśli jest już gotowa —
// dopiero teraz ustawia status "shipped" i wysyła klientowi prawdziwy numer śledzenia.
export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id } = await req.json();
  const sql = getDb();
  const [order] = await sql`SELECT * FROM orders WHERE id = ${order_id}`;
  if (!order) return NextResponse.json({ error: "Brak zamówienia" }, { status: 404 });
  if (!order.shipment_id) return NextResponse.json({ error: "Brak przesyłki — najpierw utwórz etykietę" }, { status: 400 });

  const token = process.env.INPOST_SHIPX_TOKEN;
  if (!token) return NextResponse.json({ error: "Brak INPOST_SHIPX_TOKEN" }, { status: 500 });

  const res = await fetch(`https://api-shipx-pl.easypack24.net/v1/shipments/${order.shipment_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message ?? "Błąd InPost API", detail: data }, { status: 502 });

  // Zbierz powody odrzucenia oferty, jeśli są — pomaga zdiagnozować dlaczego utknęło.
  const unavailableReasons = (data.offers ?? [])
    .flatMap((o: { unavailability_reasons?: { message: string }[] }) => o.unavailability_reasons ?? [])
    .map((r: { message: string }) => r.message);

  if (!data.tracking_number) {
    return NextResponse.json({
      ok: true,
      ready: false,
      shipment_status: data.status,
      unavailable_reasons: unavailableReasons,
    });
  }

  // Tracking number już jest — dokończ flow, jeśli jeszcze nie oznaczyliśmy zamówienia jako wysłane.
  if (!order.tracking_number) {
    await sql`UPDATE orders SET tracking_number = ${data.tracking_number}, status = 'shipped', updated_at = NOW() WHERE id = ${order_id}`;

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
  }

  return NextResponse.json({ ok: true, ready: true, tracking_number: data.tracking_number, shipment_status: data.status });
}
