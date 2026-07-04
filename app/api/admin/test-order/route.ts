import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { cookies } from "next/headers";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

// Tymczasowy endpoint do ręcznego wstawienia testowego zamówienia firmowego —
// sprawdzenie odznaki "Faktura" na liście bez przechodzenia przez prawdziwy checkout/Stripe.
export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const orderNumber = "GS-TESTFIRMA" + Math.floor(Math.random() * 1000);
  const fakeIntentId = "test_" + crypto.randomUUID();

  await sql`
    INSERT INTO orders (
      order_number, stripe_payment_intent_id, status,
      customer_name, customer_email, customer_phone,
      address_line1, city, postal_code,
      delivery_method, inpost_locker,
      company_name, nip, invoice_type,
      items, total_pln
    ) VALUES (
      ${orderNumber}, ${fakeIntentId}, 'new',
      'Test Testowski', 'test-firma@example.com', '500100200',
      'ul. Testowa 1', 'Warszawa', '00-001',
      'courier', '',
      'Firma Testowa Sp. z o.o.', '1234567890', 'invoice',
      ${JSON.stringify([{ name: "GoodStim VNS One", qty: 1, price: 0 }])}, 0
    )
  `;

  return NextResponse.json({ ok: true, order_number: orderNumber });
}
