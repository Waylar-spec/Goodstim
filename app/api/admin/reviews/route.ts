import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const reviews = await sql`
    SELECT id, order_number, customer_name, reviewer_name, rating, review_text, status, submitted_at, created_at
    FROM reviews
    WHERE status != 'pending_submission'
    ORDER BY submitted_at DESC
  `;

  return NextResponse.json({ reviews });
}

export async function PATCH(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const sql = getDb();
  await sql`UPDATE reviews SET status = ${status} WHERE id = ${id}`;

  return NextResponse.json({ ok: true });
}
