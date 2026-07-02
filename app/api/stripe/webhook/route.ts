import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { createAndSendInvoice } from "../../../lib/fakturownia";
import { getTier } from "../../../lib/affiliate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "wojtekdymek95@gmail.com";

export function adminOrderEmailHtml(params: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  lockerPoint: string;
  items: { name: string; qty: number }[];
  total: number;
}) {
  const { orderNumber, customerName, customerEmail, customerPhone, deliveryMethod, lockerPoint, items, total } = params;
  const delivery = deliveryMethod === "inpost" ? `InPost Paczkomat — ${lockerPoint || "?"}` : "InPost Kurier";
  const itemsList = items.map(i => `${i.name} ×${i.qty}`).join(", ");
  const messages = [
    "Ktoś właśnie uwierzył w GoodStim. Czas działać! 💪",
    "Kolejny człowiek na drodze do lepszego snu i spokoju. 🌙",
    "To dopiero początek. Każde zamówienie to krok do przodu. 🚀",
    "Produkt działa — ludzie kupują. Tak trzymaj! 🔥",
    "Jeden klient więcej, jedna historia sukcesu w drodze. ✨",
  ];
  const msg = messages[Math.floor(total * 137) % messages.length];

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#050a14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050a14;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <!-- TOP BANNER -->
        <tr><td style="background:linear-gradient(135deg,#0d2137 0%,#0a3d2e 100%);border-radius:20px 20px 0 0;padding:36px 40px;text-align:center">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2AE5A5;letter-spacing:3px;text-transform:uppercase">GoodStim · Nowa sprzedaż</p>
          <p style="margin:0;font-size:48px;line-height:1.1">💸</p>
          <h1 style="margin:12px 0 0;font-size:36px;font-weight:900;color:#ffffff;letter-spacing:-1px">
            +${total.toFixed(2)} PLN
          </h1>
          <p style="margin:8px 0 0;font-size:15px;color:#94a3b8">${msg}</p>
        </td></tr>

        <!-- ORDER DETAILS -->
        <tr><td style="background:#0d1524;padding:32px 40px">

          <!-- Order number badge -->
          <div style="display:inline-block;background:#1e3a5f;border:1px solid #2563eb40;border-radius:8px;padding:8px 16px;margin-bottom:24px">
            <span style="color:#60a5fa;font-size:13px;font-weight:700;font-family:monospace;letter-spacing:1px">#${orderNumber}</span>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["👤 Klient", customerName],
              ["📧 Email", customerEmail],
              ["📱 Telefon", customerPhone || "—"],
              ["📦 Dostawa", delivery],
              ["🛍 Produkty", itemsList],
            ].map(([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#64748b;font-size:13px;width:130px;vertical-align:top">${label}</td>
              <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#e2e8f0;font-size:14px;font-weight:500">${value}</td>
            </tr>`).join("")}
            <tr>
              <td style="padding:16px 0 0;color:#64748b;font-size:13px">💰 Kwota</td>
              <td style="padding:16px 0 0;color:#2AE5A5;font-size:24px;font-weight:900">${total.toFixed(2)} PLN</td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#0d1524;padding:0 40px 36px;border-radius:0 0 20px 20px;text-align:center">
          <a href="https://goodstim.pl/admin" style="display:inline-block;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.3px">
            Otwórz panel admina →
          </a>
          <p style="margin:16px 0 0;color:#334155;font-size:12px">goodstim.pl/admin</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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

    // Zapisz zamówienie do bazy. RETURNING + ON CONFLICT = idempotencja:
    // przy ponowieniu webhooka przez Stripe nie zdublujemy maili ani faktury.
    let isNewOrder = false;
    try {
      const sql = getDb();
      const inserted = await sql`
        INSERT INTO orders (
          order_number, stripe_payment_intent_id, status,
          customer_name, customer_email, customer_phone,
          address_line1, city, postal_code,
          delivery_method, inpost_locker,
          company_name, nip, invoice_type,
          items, total_pln, affiliate_code
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
          ${totalPln},
          ${meta.affiliate_code || null}
        )
        ON CONFLICT (stripe_payment_intent_id) DO NOTHING
        RETURNING id
      `;
      isNewOrder = inserted.length > 0;
    } catch (dbErr) {
      console.error("DB insert error:", dbErr);
      // Realny błąd bazy → 500, Stripe ponowi webhook później.
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // Zamówienie już przetworzone (powtórka webhooka) — nie dubluj efektów ubocznych.
    if (!isNewOrder) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    // Zamówienie doszło do skutku — nie wysyłaj już przypomnienia o porzuconym koszyku dla tego maila
    if (meta.customer_email) {
      try {
        const sql = getDb();
        await sql`
          UPDATE abandoned_carts SET recovered = TRUE
          WHERE email = ${meta.customer_email.toLowerCase()} AND recovered = FALSE
        `;
      } catch (cartErr) {
        console.error("Abandoned cart mark-recovered error:", cartErr);
      }
    }

    // Prowizja afiliacyjna — poziom liczony ze skumulowanej sprzedaży PRZED tym zamówieniem (tylko w górę)
    if (meta.affiliate_code) {
      try {
        const sql = getDb();
        const affRows = await sql`SELECT id, total_units_sold FROM affiliates WHERE code = ${meta.affiliate_code} AND status = 'active'`;
        if (affRows.length > 0) {
          const unitsBefore = affRows[0].total_units_sold as number;
          const unitsThisOrder = items.reduce((s: number, i: { qty: number }) => s + i.qty, 0);
          const tier = getTier(unitsBefore);
          const commission = Math.round(totalPln * tier.rate * 100) / 100;

          await sql`
            UPDATE orders
            SET affiliate_commission_pln = ${commission}, affiliate_tier = ${tier.name}
            WHERE order_number = ${orderNumber}
          `;
          await sql`
            UPDATE affiliates SET total_units_sold = total_units_sold + ${unitsThisOrder}
            WHERE id = ${affRows[0].id}
          `;
        }
      } catch (affErr) {
        console.error("Affiliate commission error:", affErr);
      }
    }

    // Faktura / rachunek w Fakturowni + automatyczna wysyłka do klienta
    await createAndSendInvoice({
      orderNumber,
      buyerName: meta.want_invoice === "1" ? (meta.company_name || meta.customer_name || "") : (meta.customer_name ?? ""),
      buyerEmail: meta.customer_email ?? "",
      buyerTaxNo: meta.want_invoice === "1" ? (meta.nip || undefined) : undefined,
      items: items.map((i: { name: string; qty: number; price: number }) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: totalPln,
    });

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
      subject: `💸 +${totalPln.toFixed(2)} PLN — zamówienie #${orderNumber}`,
      html: adminOrderEmailHtml({
        orderNumber,
        customerName: meta.customer_name ?? "—",
        customerEmail: meta.customer_email ?? "—",
        customerPhone: meta.customer_phone ?? "",
        deliveryMethod: meta.delivery_method ?? "courier",
        lockerPoint: meta.inpost_locker ?? "",
        items: items.map((i: { name: string; qty: number }) => ({ name: i.name, qty: i.qty })),
        total: totalPln,
      }),
    }).catch(e => console.error("Admin email error:", e));
  }

  return NextResponse.json({ received: true });
}
