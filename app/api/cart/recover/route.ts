import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Brak tokenu" }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT email, name, phone, items, total_pln FROM abandoned_carts WHERE token = ${token}
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Nie znaleziono" }, { status: 404 });

  return NextResponse.json({
    email: rows[0].email,
    name: rows[0].name,
    phone: rows[0].phone,
    items: rows[0].items,
    total: parseFloat(rows[0].total_pln),
  });
}
