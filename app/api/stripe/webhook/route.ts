import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "wojtekdymek95@gmail.com";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
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
      const sql = getDb();
      await sql`
        INSERT INTO orders (
          order_number, stripe_payment_intent_id, status,
          customer_name, customer_email, customer_phone,
          address_line1, city, postal_code,
          delivery_method, inpost_locker,
          company_name, nip, invoice_type,
          items, total_pln
        ) VALUES (
          ${orderNumber}, ${intent.id}, 'new',
          ${meta.customer_name ?? ""},
          ${meta.customer_email ?? ""},
          ${meta.customer_phone ?? ""},
          ${meta.address_line1 ?? ""},
          ${meta.city ?? ""},
          ${meta.postal_code ?? ""},
          ${meta.delivery_method ?? "courier"},
          ${meta.inpost_locker ?? ""},
          ${meta.company_name ?? ""},
          ${meta.nip ?? ""},
          ${meta.want_invoice === "1" ? "invoice" : "receipt"},
          ${JSON.stringify(items)},
          ${totalPln}
        )
        ON CONFLICT (stripe_payment_intent_id) DO NOTHING
      `;
    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    // Email potwierdzenia do klienta
    if (meta.customer_email) {
      await fetch(`${base}/api/email/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: meta.customer_email,
          firstName: (meta.customer_name ?? "Kliencie").split(" ")[0],
          orderNumber,
          items,
          total: totalPln,
          deliveryMethod: meta.delivery_method ?? "courier",
          lockerPoint: meta.inpost_locker ?? "",
        }),
      });
    }

    // Powiadomienie dla admina
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `💰 Nowe zamówienie #${orderNumber} — ${totalPln.toFixed(2)} PLN`,
      html: `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:24px;background:#0a0f1e;color:#fff">
        <h2 style="color:#2AE5A5;margin:0 0 16px">Nowe zamówienie! 🎉</h2>
        <table style="border-collapse:collapse;width:100%;max-width:480px">
          <tr><td style="padding:8px 0;color:#94a3b8;width:140px">Zamówienie</td><td style="color:#fff;font-weight:700">#${orderNumber}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Klient</td><td style="color:#fff">${meta.customer_name ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="color:#fff">${meta.customer_email ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Telefon</td><td style="color:#fff">${meta.customer_phone ?? "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Dostawa</td><td style="color:#fff">${meta.delivery_method === "inpost" ? `InPost Paczkomat (${meta.inpost_locker ?? "?"})` : "InPost Kurier"}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Produkty</td><td style="color:#fff">${items.map((i: {name:string;qty:number}) => `${i.name} ×${i.qty}`).join(", ")}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Kwota</td><td style="color:#2AE5A5;font-size:20px;font-weight:800">${totalPln.toFixed(2)} PLN</td></tr>
        </table>
        <br/>
        <a href="https://goodstim.pl/admin" style="display:inline-block;background:#0057B8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Otwórz panel admina →</a>
      </body></html>`,
    }).catch(e => console.error("Admin email error:", e));
  }

  return NextResponse.json({ received: true });
}
