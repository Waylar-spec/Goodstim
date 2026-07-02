import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getTier, getNextTier } from "../../../lib/affiliate";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Brak tokenu" }, { status: 400 });

  const sql = getDb();
  const rows = await sql`SELECT * FROM affiliates WHERE token = ${token}`;
  if (rows.length === 0) return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });

  const affiliate = rows[0];

  const sales = await sql`
    SELECT order_number, created_at, total_pln, affiliate_commission_pln, affiliate_tier, affiliate_payout_status
    FROM orders
    WHERE affiliate_code = ${affiliate.code} AND stripe_payment_intent_id IS NOT NULL
    ORDER BY created_at DESC
  `;

  const totalEarned = sales.reduce((s, o) => s + parseFloat(o.affiliate_commission_pln ?? "0"), 0);
  const pending = sales
    .filter(o => o.affiliate_payout_status === "pending")
    .reduce((s, o) => s + parseFloat(o.affiliate_commission_pln ?? "0"), 0);
  const paid = totalEarned - pending;

  const currentTier = getTier(affiliate.total_units_sold);
  const nextTier = getNextTier(affiliate.total_units_sold);

  return NextResponse.json({
    name: affiliate.name,
    code: affiliate.code,
    bankAccount: affiliate.bank_account,
    totalUnitsSold: affiliate.total_units_sold,
    currentTier,
    nextTier,
    unitsToNextTier: nextTier ? nextTier.minUnits - affiliate.total_units_sold : null,
    totalEarned,
    pending,
    paid,
    sales,
  });
}

export async function PATCH(req: NextRequest) {
  const { token, bankAccount } = await req.json();
  if (!token) return NextResponse.json({ error: "Brak tokenu" }, { status: 400 });

  const sql = getDb();
  const rows = await sql`SELECT id FROM affiliates WHERE token = ${token}`;
  if (rows.length === 0) return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });

  await sql`UPDATE affiliates SET bank_account = ${bankAccount ?? null} WHERE token = ${token}`;
  return NextResponse.json({ ok: true });
}
