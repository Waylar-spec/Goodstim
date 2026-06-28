import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function DELETE() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = getDb();
  const result = await sql`DELETE FROM orders RETURNING id`;
  return NextResponse.json({ deleted: result.length });
}
