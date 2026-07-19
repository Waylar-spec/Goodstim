import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { processReturnRequest, type OrderRow } from "../../../../lib/returns";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

// Ręczne zgłoszenie zwrotu z panelu admina — celowo pomija limit dni z /api/returns/request,
// bo to świadomy wyjątek robiony na decyzję właściciela sklepu (np. klient spóźnił się o dzień).
export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderNumber, reason } = await req.json();
  if (!orderNumber || !reason) {
    return NextResponse.json({ error: "Podaj numer zamówienia i powód." }, { status: 400 });
  }

  const sql = getDb();
  const [order] = await sql`SELECT * FROM orders WHERE order_number = ${orderNumber.trim()}`;
  if (!order) return NextResponse.json({ error: "Nie znaleziono zamówienia o podanym numerze." }, { status: 404 });
  if (order.status === "cancelled") {
    return NextResponse.json({ error: "To zamówienie zostało anulowane." }, { status: 400 });
  }

  const [existing] = await sql`
    SELECT * FROM return_requests WHERE order_id = ${order.id} AND status != 'rejected'
  `;
  if (existing) {
    return NextResponse.json({ error: "Dla tego zamówienia zgłoszenie zwrotu już istnieje." }, { status: 400 });
  }

  const result = await processReturnRequest(order as unknown as OrderRow, reason);
  return NextResponse.json({ ok: true, id: result.id });
}
