import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getTier } from "../../../lib/affiliate";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const affiliates = await sql`SELECT * FROM affiliates ORDER BY created_at DESC`;

  const withStats = await Promise.all(affiliates.map(async (a) => {
    const sales = await sql`
      SELECT affiliate_commission_pln, affiliate_payout_status, created_at
      FROM orders WHERE affiliate_code = ${a.code} AND stripe_payment_intent_id IS NOT NULL
      ORDER BY created_at DESC
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
      lastSaleAt: sales[0]?.created_at ?? null,
    };
  }));

  return NextResponse.json({ affiliates: withStats });
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, action } = await req.json();
  const sql = getDb();

  if (action === "mark_paid") {
    await sql`
      UPDATE orders SET affiliate_payout_status = 'paid'
      WHERE affiliate_code = ${code} AND affiliate_payout_status = 'pending'
    `;
    return NextResponse.json({ ok: true });
  }

  if (action === "deactivate" || action === "reactivate") {
    const status = action === "deactivate" ? "inactive" : "active";
    await sql`UPDATE affiliates SET status = ${status} WHERE code = ${code}`;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Brak kodu" }, { status: 400 });

  const sql = getDb();
  const sales = await sql`SELECT id FROM orders WHERE affiliate_code = ${code} LIMIT 1`;
  if (sales.length > 0) {
    return NextResponse.json({ error: "Nie można usunąć — afiliant ma sprzedaże. Można go tylko dezaktywować." }, { status: 409 });
  }

  await sql`DELETE FROM affiliates WHERE code = ${code}`;
  return NextResponse.json({ ok: true });
}
