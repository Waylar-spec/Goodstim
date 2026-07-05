import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

const ALLOWED = ["requested", "label_sent", "received", "refunded", "rejected"];

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Nieprawidłowy status" }, { status: 400 });

  const sql = getDb();
  if (status === "refunded") {
    await sql`UPDATE return_requests SET status = ${status}, refunded_at = NOW(), updated_at = NOW() WHERE id = ${id}`;
  } else {
    await sql`UPDATE return_requests SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
  }

  return NextResponse.json({ ok: true });
}
