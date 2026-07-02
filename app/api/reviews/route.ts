import { NextResponse } from "next/server";
import { getDb } from "../../lib/db";

export async function GET() {
  const sql = getDb();
  const rows = await sql`
    SELECT reviewer_name, rating, review_text, submitted_at
    FROM reviews
    WHERE status = 'approved'
    ORDER BY submitted_at DESC
    LIMIT 20
  `;
  return NextResponse.json({ reviews: rows });
}
