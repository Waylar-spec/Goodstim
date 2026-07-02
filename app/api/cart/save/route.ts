import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const { email, name, phone, items, total } = await req.json();

  if (!email?.trim() || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
  }

  const sql = getDb();
  const cleanEmail = email.trim().toLowerCase();
  const cleanItems = items.map((i: { id: string; qty: number }) => ({ id: String(i.id), qty: Number(i.qty) }));

  const existing = await sql`
    SELECT id FROM abandoned_carts WHERE email = ${cleanEmail} AND recovered = FALSE
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE abandoned_carts
      SET name = ${name ?? ""}, phone = ${phone ?? ""},
          items = ${JSON.stringify(cleanItems)}, total_pln = ${total},
          updated_at = NOW(), reminder_sent_at = NULL
      WHERE id = ${existing[0].id}
    `;
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomUUID();
  await sql`
    INSERT INTO abandoned_carts (token, email, name, phone, items, total_pln)
    VALUES (${token}, ${cleanEmail}, ${name ?? ""}, ${phone ?? ""}, ${JSON.stringify(cleanItems)}, ${total})
  `;

  return NextResponse.json({ ok: true });
}
