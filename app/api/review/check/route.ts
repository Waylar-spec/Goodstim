import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ status: "invalid" });

  const sql = getDb();
  const rows = await sql`SELECT status FROM reviews WHERE token = ${token}`;

  if (rows.length === 0) return NextResponse.json({ status: "invalid" });
  return NextResponse.json({ status: rows[0].status });
}
