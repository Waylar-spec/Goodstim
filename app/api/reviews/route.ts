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
  // Zatwierdzone opinie zmieniają się rzadko — CDN trzyma odpowiedź 5 min, zamiast odpalać
  // funkcję + zapytanie do Neon przy każdym wejściu na /shop.
  return NextResponse.json(
    { reviews: rows },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
