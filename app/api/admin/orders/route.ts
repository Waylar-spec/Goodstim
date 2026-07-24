import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb(); // idempotent — gwarantuje migracje kolumn
  const sql = getDb();
  const orders = await sql`
    SELECT * FROM orders ORDER BY created_at DESC LIMIT 200
  `;
  return NextResponse.json({ orders });
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Brak id" }, { status: 400 });

  const sql = getDb();
  // Usuń najpierw powiązane rekordy (brak ON DELETE CASCADE w schemacie).
  await sql`DELETE FROM return_requests WHERE order_id = ${id}`;
  await sql`DELETE FROM reviews WHERE order_id = ${id}`;
  await sql`DELETE FROM orders WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status, tracking_number, notes } = await req.json();
  const sql = getDb();
  await sql`
    UPDATE orders SET
      status = COALESCE(${status ?? null}, status),
      tracking_number = COALESCE(${tracking_number ?? null}, tracking_number),
      notes = COALESCE(${notes ?? null}, notes),
      updated_at = NOW()
    WHERE id = ${id}
  `;
  return NextResponse.json({ ok: true });
}
