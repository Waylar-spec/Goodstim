import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

// Czyści przesyłkę utkniętą w błędnym stanie (np. odrzucona oferta ShipX), żeby dało się
// bezpiecznie spróbować utworzyć nową etykietę zamiast pozostać zablokowanym na stare shipment_id.
export async function POST(req: NextRequest) {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id } = await req.json();
  const sql = getDb();
  await sql`
    UPDATE orders
    SET shipment_id = NULL, tracking_number = NULL, status = 'new', updated_at = NOW()
    WHERE id = ${order_id}
  `;

  return NextResponse.json({ ok: true });
}
