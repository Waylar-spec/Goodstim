import { initDb, initSubscribersTable } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initDb();
    await initSubscribersTable();
    return NextResponse.json({ ok: true, message: "Tabele orders i newsletter_subscribers gotowe" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
