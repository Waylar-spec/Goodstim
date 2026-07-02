import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getTier } from "../../../lib/affiliate";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("admin_auth")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const affiliates = await sql`SELECT * FROM affiliates ORDER BY created_at DESC`;

  const withStats = await Promise.all(affiliates.map(async (a) => {
    const sales = await sql`
      SELECT affiliate_commission_pln, affiliate_payout_status
      FROM orders WHERE affiliate_code = ${a.code} AND stripe_payment_intent_id IS NOT NULL
    `;
    const totalEarned = sales.reduce((s, o) => s + parseFloat(o.affiliate_commission_pln ?? "0"), 0);
    const pending = sales
      .filter(o => o.affiliate_payout_status === "pending")
      .reduce((s, o) => s + parseFloat(o.affiliate_commission_pln ?? "0"), 0);
    return {
      ...a,
      tier: getTier(a.total_units_sold).name,
      salesCount: sales.length,
      totalEarned,
      pending,
    };
  }));

  return NextResponse.json({ affiliates: withStats });
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, action } = await req.json();
  if (action !== "mark_paid") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  const sql = getDb();
  await sql`
    UPDATE orders SET affiliate_payout_status = 'paid'
    WHERE affiliate_code = ${code} AND affiliate_payout_status = 'pending'
  `;

  return NextResponse.json({ ok: true });
}
