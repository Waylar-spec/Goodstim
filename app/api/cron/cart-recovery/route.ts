import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { getProduct } from "../../../lib/products";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function cartRecoveryEmailHtml(params: {
  firstName: string;
  itemsList: string;
  total: number;
  recoveryUrl: string;
}) {
  const { firstName, itemsList, total, recoveryUrl } = params;
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">

        <tr><td style="background:linear-gradient(135deg,#0d2137 0%,#0a3d2e 100%);padding:40px;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#2AE5A5;letter-spacing:3px;text-transform:uppercase">GoodStim</p>
          <p style="margin:0;font-size:48px">🛒</p>
          <h1 style="margin:12px 0 0;font-size:24px;font-weight:800;color:#ffffff">Zostawiłeś coś w koszyku</h1>
        </td></tr>

        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 16px;font-size:16px;color:#1e293b">Cześć ${firstName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6">
            Zacząłeś(-aś) składać zamówienie na GoodStim, ale coś Ci przeszkodziło dokończyć. Twój koszyk czeka na Ciebie:
          </p>

          <div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;margin-bottom:24px">
            <p style="margin:0 0 4px;font-size:13px;color:#475569">${itemsList}</p>
            <p style="margin:8px 0 0;font-size:20px;font-weight:800;color:#0d1524">${total.toFixed(2)} zł</p>
          </div>

          <div style="text-align:center;margin:28px 0">
            <a href="${recoveryUrl}" style="display:inline-block;background:#2AE5A5;color:#0d1524;font-weight:800;font-size:16px;padding:16px 36px;border-radius:50px;text-decoration:none">Dokończ zamówienie →</a>
          </div>

          <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center">
            Masz pytania przed zakupem? Napisz na <a href="mailto:kontakt@goodstim.pl" style="color:#2AE5A5">kontakt@goodstim.pl</a>
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

  const carts = await sql`
    SELECT id, token, email, name, items, total_pln
    FROM abandoned_carts
    WHERE recovered = FALSE
      AND reminder_sent_at IS NULL
      AND created_at <= NOW() - INTERVAL '1 hour'
    LIMIT 50
  `;

  let sent = 0;
  const errors: string[] = [];

  for (const cart of carts) {
    try {
      const items = (cart.items as { id: string; qty: number }[])
        .map(i => {
          const p = getProduct(i.id);
          return p ? `${p.name} ×${i.qty}` : null;
        })
        .filter(Boolean)
        .join(", ");

      if (!items) continue;

      const firstName = ((cart.name as string) || "Kliencie").split(" ")[0];
      const recoveryUrl = `${base}/checkout?recover=${cart.token}`;

      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "GoodStim <kontakt@goodstim.pl>",
        to: cart.email as string,
        subject: "Zostawiłeś coś w koszyku 🛒",
        html: cartRecoveryEmailHtml({
          firstName,
          itemsList: items,
          total: parseFloat(cart.total_pln as string),
          recoveryUrl,
        }),
      });

      await sql`UPDATE abandoned_carts SET reminder_sent_at = NOW() WHERE id = ${cart.id}`;
      sent++;
    } catch (e) {
      errors.push(`${cart.email}: ${e}`);
    }
  }

  return NextResponse.json({ ok: true, sent, errors });
}
