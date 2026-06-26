import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

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
    const { customer_email, customer_name, order_number, items_json } = intent.metadata;

    if (customer_email) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer_email,
          firstName: customer_name ?? "Kliencie",
          orderNumber: order_number ?? `GS-${intent.id.slice(-6).toUpperCase()}`,
          items: items_json ? JSON.parse(items_json) : [],
          total: intent.amount / 100,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
