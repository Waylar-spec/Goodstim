import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function trackingEmailHtml(params: {
  firstName: string;
  orderNumber: string;
  trackingNumber: string;
  deliveryMethod: string;
}) {
  const { firstName, orderNumber, trackingNumber, deliveryMethod } = params;
  const isPaczkomat = deliveryMethod === "inpost";
  const trackingUrl = `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7fdf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fdf9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <tr><td style="background:#252537;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center">
          <span style="font-size:28px;font-weight:800;color:#2AE5A5;letter-spacing:-0.5px">GoodStim</span>
        </td></tr>

        <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px">
          <h1 style="font-size:24px;font-weight:700;color:#252537;margin:0 0 8px">
            Twoja paczka jest w drodze! 🚀
          </h1>
          <p style="color:#718096;font-size:15px;margin:0 0 32px;line-height:1.6">
            Hej ${firstName}! Zamówienie <strong style="color:#252537">#${orderNumber}</strong> zostało nadane przez ${isPaczkomat ? "InPost Paczkomat" : "InPost Kurier"}.
          </p>

          <!-- Tracking box -->
          <div style="background:#f7fdf9;border:2px solid #2AE5A5;border-radius:16px;padding:28px;margin-bottom:32px;text-align:center">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#718096;text-transform:uppercase;letter-spacing:0.5px">Numer śledzenia</p>
            <p style="margin:0 0 20px;font-size:28px;font-weight:800;color:#252537;letter-spacing:2px;font-family:monospace">
              ${trackingNumber}
            </p>
            <a href="${trackingUrl}" style="display:inline-block;background:#2AE5A5;color:#252537;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none">
              Śledź paczkę InPost →
            </a>
          </div>

          <div style="background:#EEF4FF;border-radius:12px;padding:16px 20px;margin-bottom:32px">
            <p style="margin:0;color:#4A5568;font-size:14px;line-height:1.6">
              ${isPaczkomat
                ? "📦 Paczka trafi do wybranego przez Ciebie Paczkomatu w ciągu <strong>1–2 dni roboczych</strong>. Otrzymasz powiadomienie SMS/email od InPost."
                : "🚚 Kurier dostarczy paczkę w ciągu <strong>1–2 dni roboczych</strong>. Numer możesz śledzić na stronie InPost."}
            </p>
          </div>

          <p style="color:#a0aec0;font-size:13px;text-align:center;margin:0">
            Pytania? <a href="mailto:kontakt@goodstim.pl" style="color:#2AE5A5">kontakt@goodstim.pl</a>
          </p>
        </td></tr>

        <tr><td style="padding:24px 40px;text-align:center">
          <p style="color:#a0aec0;font-size:12px;margin:0">© 2025 GoodStim</p>
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
    const { email, firstName, orderNumber, trackingNumber, deliveryMethod } = body as {
      email: string;
      firstName: string;
      orderNumber: string;
      trackingNumber: string;
      deliveryMethod: string;
    };

    if (!email || !trackingNumber) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
      to: email,
      subject: `Twoja paczka jedzie! Numer śledzenia: ${trackingNumber}`,
      html: trackingEmailHtml({ firstName, orderNumber, trackingNumber, deliveryMethod }),
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
