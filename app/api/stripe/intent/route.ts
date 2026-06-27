import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, metadata } = await req.json();
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "pln",
      payment_method_types: ["card", "blik"],
      ...(metadata ? { metadata } : {}),
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
