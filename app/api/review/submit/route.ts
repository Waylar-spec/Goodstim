import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const { token, reviewerName, rating, reviewText } = await req.json();

  if (!token || !reviewerName || !rating || !reviewText) {
    return NextResponse.json({ error: "Brakujące pola" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Nieprawidłowa ocena" }, { status: 400 });
  }
  if (reviewText.trim().length < 10) {
    return NextResponse.json({ error: "Opinia jest za krótka" }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`SELECT id, status FROM reviews WHERE token = ${token}`;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Nieprawidłowy link" }, { status: 404 });
  }
  if (rows[0].status !== "pending_submission") {
    return NextResponse.json({ error: "Opinia już została wysłana" }, { status: 409 });
  }

  await sql`
    UPDATE reviews
    SET reviewer_name = ${reviewerName.trim()},
        rating = ${rating},
        review_text = ${reviewText.trim()},
        status = 'pending_approval',
        submitted_at = NOW()
    WHERE token = ${token}
  `;

  return NextResponse.json({ ok: true });
}
