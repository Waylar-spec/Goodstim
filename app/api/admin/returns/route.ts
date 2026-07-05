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
  const returns = await sql`
    SELECT r.*, o.customer_name, o.total_pln
    FROM return_requests r
    LEFT JOIN orders o ON o.id = r.order_id
    ORDER BY r.created_at DESC
    LIMIT 200
  `;

  return NextResponse.json({ returns });
}
