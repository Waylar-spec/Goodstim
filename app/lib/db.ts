import { neon } from "@neondatabase/serverless";

export function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  return neon(process.env.DATABASE_URL);
}

export async function initSubscribersTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL DEFAULT 'maintenance',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      stripe_payment_intent_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'new',

      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      address_line1 TEXT,
      city TEXT,
      postal_code TEXT,
      delivery_method TEXT NOT NULL DEFAULT 'courier',
      inpost_locker TEXT,

      items JSONB NOT NULL DEFAULT '[]',
      total_pln NUMERIC(10,2) NOT NULL,

      tracking_number TEXT,
      shipment_id TEXT,
      label_url TEXT,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Migrate existing tables — add columns if missing
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT NOT NULL DEFAULT 'courier'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS inpost_locker TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipment_id TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS label_url TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS company_name TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS nip TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_type TEXT NOT NULL DEFAULT 'receipt'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS review_requested_at TIMESTAMPTZ`;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      order_id INTEGER REFERENCES orders(id),
      order_number TEXT,
      customer_name TEXT,
      customer_email TEXT,
      reviewer_name TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      review_text TEXT,
      status TEXT NOT NULL DEFAULT 'pending_submission',
      submitted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS affiliates (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      token TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      bank_account TEXT,
      total_units_sold INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_code TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_commission_pln NUMERIC(10,2)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_tier TEXT`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_payout_status TEXT DEFAULT 'pending'`;
}
