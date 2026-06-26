import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export default sql;

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      stripe_payment_intent_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'new',

      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      address_line1 TEXT,
      city TEXT,
      postal_code TEXT,

      items JSONB NOT NULL DEFAULT '[]',
      total_pln NUMERIC(10,2) NOT NULL,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
