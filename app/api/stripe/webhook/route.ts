import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import sql from "../../../lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const meta = intent.metadata ?? {};
    const orderNumber = meta.order_number ?? `GS-${intent.id.slice(-6).toUpperCase()}`;
    const items = meta.items_json ? JSON.parse(meta.items_json) : [];
    const totalPln = intent.amount / 100;

    // Zapisz zamówienie do bazy
    try {
      await sql`
        INSERT INTO orders (
          order_number, stripe_payment_intent_id, status,
          customer_name, customer_email,
          address_line1, city, postal_code,
          items, total_pln
        ) VALUES (
          ${orderNumber}, ${intent.id}, 'new',
          ${meta.customer_name ?? ""},
          ${meta.customer_email ?? ""},
          ${meta.address_line1 ?? ""},
          ${meta.city ?? ""},
          ${meta.postal_code ?? ""},
          ${JSON.stringify(items)},
          ${totalPln}
        )
        ON CONFLICT (stripe_payment_intent_id) DO NOTHING
      `;
    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
    }

    // Wyślij email potwierdzenia
    if (meta.customer_email) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: meta.customer_email,
          firstName: meta.customer_name ?? "Kliencie",
          orderNumber,
          items,
          total: totalPln,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
