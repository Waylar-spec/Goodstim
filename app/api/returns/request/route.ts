import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { processReturnRequest, type OrderRow } from "../../../lib/returns";

const RETURN_WINDOW_DAYS = 14;

export async function POST(req: NextRequest) {
  const { orderNumber, email, reason } = await req.json();

  if (!orderNumber || !email || !reason) {
    return NextResponse.json({ error: "Uzupełnij numer zamówienia, e-mail i powód zwrotu." }, { status: 400 });
  }

  const sql = getDb();
  const [order] = await sql`
    SELECT * FROM orders
    WHERE order_number = ${orderNumber.trim()} AND LOWER(customer_email) = LOWER(${email.trim()})
  `;

  if (!order) {
    return NextResponse.json({ error: "Nie znaleziono zamówienia o podanym numerze i adresie e-mail." }, { status: 404 });
  }
  if (order.status === "cancelled") {
    return NextResponse.json({ error: "To zamówienie zostało anulowane." }, { status: 400 });
  }

  const daysSincePurchase = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePurchase > RETURN_WINDOW_DAYS) {
    return NextResponse.json({ error: `Minęło już ${RETURN_WINDOW_DAYS} dni od zakupu — okres na zwrot minął.` }, { status: 400 });
  }

  const [existing] = await sql`
    SELECT * FROM return_requests WHERE order_id = ${order.id} AND status != 'rejected'
  `;
  if (existing) {
    return NextResponse.json({ error: "Dla tego zamówienia zgłoszenie zwrotu już istnieje. Sprawdź swoją skrzynkę mailową." }, { status: 400 });
  }

  const result = await processReturnRequest(order as unknown as OrderRow, reason);
  return NextResponse.json({ ok: true, id: result.id });
}
