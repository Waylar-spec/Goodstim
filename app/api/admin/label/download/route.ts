import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ error: "Brak order_id" }, { status: 400 });

  const sql = getDb();
  const [order] = await sql`SELECT shipment_id, order_number FROM orders WHERE id = ${orderId}`;
  if (!order?.shipment_id) {
    return NextResponse.json({ error: "Brak przesyłki. Najpierw utwórz etykietę." }, { status: 404 });
  }

  const token = process.env.INPOST_SHIPX_TOKEN;
  if (!token) return NextResponse.json({ error: "Brak INPOST_SHIPX_TOKEN" }, { status: 500 });

  // Pobierz etykietę PDF (format A6) z ShipX
  const res = await fetch(
    `https://api-shipx-pl.easypack24.net/v1/shipments/${order.shipment_id}/label?format=Pdf&type=A6`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" } }
  );

  if (!res.ok) {
    // Etykieta może się jeszcze generować (status != confirmed)
    let detail = "";
    try { detail = (await res.json())?.message ?? ""; } catch {}
    return NextResponse.json(
      { error: "Etykieta jeszcze niegotowa. Spróbuj za chwilę.", detail, status: res.status },
      { status: 409 }
    );
  }

  const pdf = await res.arrayBuffer();
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="etykieta-${order.order_number}.pdf"`,
    },
  });
}
