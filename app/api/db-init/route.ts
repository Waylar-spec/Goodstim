import { initDb } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ ok: true, message: "Tabela orders gotowa" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
