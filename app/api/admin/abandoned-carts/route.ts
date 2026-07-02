import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const carts = await sql`
    SELECT * FROM abandoned_carts
    ORDER BY created_at DESC
    LIMIT 100
  `;

  return NextResponse.json({ carts });
}
