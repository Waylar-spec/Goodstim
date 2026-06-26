import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = { name: string; subtitle: string; qty: number; price: number };

function orderEmailHtml(params: {
  firstName: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
}) {
  const { firstName, orderNumber, items, total } = params;
  const formatPLN = (n: number) =>
    new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(n);

  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #E5F6EF">
          <strong style="color:#252537">${i.name}</strong><br/>
          <span style="color:#718096;font-size:13px">${i.subtitle} · szt. ${i.qty}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #E5F6EF;text-align:right;font-weight:600;color:#252537">
          ${formatPLN(i.price * i.qty)}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7fdf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fdf9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#252537;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center">
          <span style="font-size:28px;font-weight:800;color:#2AE5A5;letter-spacing:-0.5px">GoodStim</span>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px">
          <h1 style="font-size:24px;font-weight:700;color:#252537;margin:0 0 8px">
            Dziękujemy, ${firstName}! 🎉
          </h1>
          <p style="color:#718096;font-size:15px;margin:0 0 32px;line-height:1.6">
            Twoje zamówienie <strong style="color:#252537">#${orderNumber}</strong> zostało przyjęte.
            Poinformujemy Cię, gdy paczka wyruszy w drogę.
          </p>

          <!-- Order table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            ${rows}
            <tr>
              <td style="padding-top:16px;font-size:18px;font-weight:700;color:#252537">Razem</td>
              <td style="padding-top:16px;text-align:right;font-size:18px;font-weight:700;color:#0057B8">${formatPLN(total)}</td>
            </tr>
          </table>

          <!-- Shipping note -->
          <div style="background:#f7fdf9;border-left:4px solid #2AE5A5;padding:16px 20px;border-radius:8px;margin-bottom:32px">
            <p style="margin:0;color:#252537;font-size:14px;line-height:1.6">
              📦 Wysyłka w ciągu <strong>1–2 dni roboczych</strong> · Darmowa dostawa kurierska
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-bottom:32px">
            <a href="https://goodstim.pl/the-science" style="display:inline-block;background:#0057B8;color:#ffffff;font-weight:700;font-size:14px;padding:16px 32px;border-radius:50px;text-decoration:none">
              Poznaj naukę za GoodStim
            </a>
          </div>

          <p style="color:#a0aec0;font-size:13px;text-align:center;margin:0">
            Masz pytania? Napisz na <a href="mailto:hello@goodstim.pl" style="color:#2AE5A5">hello@goodstim.pl</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;text-align:center">
          <p style="color:#a0aec0;font-size:12px;margin:0">
            © 2025 GoodStim · Urządzenie do użytku wellness, nie medycznego
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, orderNumber, items, total } = body as {
      email: string;
      firstName: string;
      orderNumber: string;
      items: OrderItem[];
      total: number;
    };

    if (!email || !firstName || !items?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
      to: email,
      subject: `Potwierdzenie zamówienia #${orderNumber} — GoodStim`,
      html: orderEmailHtml({ firstName, orderNumber, items, total }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
