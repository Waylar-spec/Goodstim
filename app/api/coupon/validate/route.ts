import { NextRequest, NextResponse } from "next/server";

interface Coupon {
  discountPct: number;
  label: string;
}

const COUPONS: Record<string, Coupon> = {
  PREMIERA10: { discountPct: 10, label: "Rabat powitalny 10%" },
  GOODSTIM10: { discountPct: 10, label: "Rabat 10%" },
  GSTEST100: { discountPct: 100, label: "Zamówienie testowe 100%" },
};

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Brak kodu" }, { status: 400 });

  const coupon = COUPONS[String(code).trim().toUpperCase()];
  if (!coupon) return NextResponse.json({ error: "Nieprawidłowy kod rabatowy" }, { status: 404 });

  return NextResponse.json({ valid: true, ...coupon });
}
