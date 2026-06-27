import { NextResponse } from "next/server";
import { getDb } from "../../lib/db";
export async function GET() {
  const sql = getDb();
  const rows = await sql`SELECT order_number, customer_name, customer_email, total_pln, created_at FROM orders ORDER BY created_at DESC LIMIT 10`;
  return NextResponse.json({ count: rows.length, orders: rows });
}
