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
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS label_url TEXT`;
}
