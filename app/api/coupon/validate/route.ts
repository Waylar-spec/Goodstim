import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

interface Coupon {
  discountPct: number;
  label: string;
}

// Promocyjne kody (PREMIERA10, GOODSTIM10) tymczasowo wyłączone — GSTEST99 zostaje jako
// wewnętrzne narzędzie do testowania checkoutu, nigdzie nie jest promowane publicznie.
const COUPONS: Record<string, Coupon> = {
  GSTEST99: { discountPct: 99, label: "Zamówienie testowe 99%" },
};

const AFFILIATE_DISCOUNT_PCT = 10;

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Brak kodu" }, { status: 400 });

  const normalized = String(code).trim().toUpperCase();

  const coupon = COUPONS[normalized];
  if (coupon) return NextResponse.json({ valid: true, ...coupon });

  // Kod afilianta wpisany ręcznie działa jak kod rabatowy — daje 10% i przypisuje sprzedaż afiliantowi
  const sql = getDb();
  const rows = await sql`SELECT code, name FROM affiliates WHERE code = ${normalized} AND status = 'active'`;
  if (rows.length > 0) {
    return NextResponse.json({
      valid: true,
      discountPct: AFFILIATE_DISCOUNT_PCT,
      label: `Kod partnera ${rows[0].name.split(" ")[0]} — rabat ${AFFILIATE_DISCOUNT_PCT}%`,
      affiliateCode: rows[0].code,
    });
  }

  return NextResponse.json({ error: "Nieprawidłowy kod rabatowy" }, { status: 404 });
}
