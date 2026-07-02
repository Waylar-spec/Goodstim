import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function reviewRequestEmailHtml(params: {
  firstName: string;
  orderNumber: string;
  reviewUrl: string;
}) {
  const { firstName, orderNumber, reviewUrl } = params;
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">

        <tr><td style="background:linear-gradient(135deg,#0d2137 0%,#0a3d2e 100%);padding:40px;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#2AE5A5;letter-spacing:3px;text-transform:uppercase">GoodStim</p>
          <p style="margin:0;font-size:48px">⭐</p>
          <h1 style="margin:12px 0 0;font-size:26px;font-weight:800;color:#ffffff">Jak oceniasz GoodStim?</h1>
          <p style="margin:8px 0 0;font-size:15px;color:#94a3b8">Twoja opinia pomaga innym podjąć decyzję</p>
        </td></tr>

        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 16px;font-size:16px;color:#1e293b">Cześć ${firstName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6">
            Minęło już trochę czasu od Twojego zamówienia <strong>#${orderNumber}</strong>.
            Mamy nadzieję, że GoodStim VNS One spełnia Twoje oczekiwania!
          </p>
          <p style="margin:0 0 32px;font-size:15px;color:#475569;line-height:1.6">
            Jeśli chcesz — zostaw krótką opinię. Zajmie to dosłownie minutę, a bardzo nam pomaga 🙏
          </p>

          <div style="text-align:center;margin:32px 0">
            <a href="${reviewUrl}" style="display:inline-block;background:#2AE5A5;color:#0d1524;font-weight:800;font-size:16px;padding:18px 40px;border-radius:50px;text-decoration:none;letter-spacing:0.3px">
              Zostaw opinię →
            </a>
          </div>

          <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;text-align:center">
            Nie chcesz zostawiać opinii? Możesz zignorować tę wiadomość.<br/>
            Masz pytania? Napisz na <a href="mailto:kontakt@goodstim.pl" style="color:#2AE5A5">kontakt@goodstim.pl</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://goodstim.pl";

  // Zamówienia opłacone, nienanulowane, starsze niż 10 dni, bez wysłanej prośby o opinię
  const orders = await sql`
    SELECT id, order_number, customer_name, customer_email
    FROM orders
    WHERE status NOT IN ('cancelled', 'refunded')
      AND stripe_payment_intent_id IS NOT NULL
      AND review_requested_at IS NULL
      AND created_at <= NOW() - INTERVAL '10 days'
      AND customer_email != ''
    LIMIT 50
  `;

  let sent = 0;
  const errors: string[] = [];

  for (const order of orders) {
    try {
      const token = crypto.randomUUID();

      await sql`
        INSERT INTO reviews (token, order_id, order_number, customer_name, customer_email, status)
        VALUES (${token}, ${order.id}, ${order.order_number}, ${order.customer_name}, ${order.customer_email}, 'pending_submission')
        ON CONFLICT DO NOTHING
      `;

      const firstName = (order.customer_name as string).split(" ")[0] || "Kliencie";
      const reviewUrl = `${base}/review/${token}`;

      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "GoodStim <kontakt@goodstim.pl>",
        to: order.customer_email as string,
        subject: `Jak oceniasz GoodStim VNS One? ⭐`,
        html: reviewRequestEmailHtml({ firstName, orderNumber: order.order_number as string, reviewUrl }),
      });

      await sql`
        UPDATE orders SET review_requested_at = NOW() WHERE id = ${order.id}
      `;

      sent++;
    } catch (e) {
      errors.push(`${order.order_number}: ${e}`);
    }
  }

  return NextResponse.json({ ok: true, sent, errors });
}
