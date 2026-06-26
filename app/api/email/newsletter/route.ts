import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // Add to Resend audience (create one in Resend dashboard first, then paste the ID below)
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({ audienceId, email, unsubscribed: false });
    }

    // Send welcome email
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
      to: email,
      subject: "Witaj w GoodStim — Twój kod rabatowy 10%",
      html: `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f7fdf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fdf9;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#252537;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center">
          <span style="font-size:28px;font-weight:800;color:#2AE5A5;letter-spacing:-0.5px">GoodStim</span>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px">
          <h1 style="font-size:24px;font-weight:700;color:#252537;margin:0 0 16px">
            Dziękujemy za zapis! 👋
          </h1>
          <p style="color:#718096;font-size:15px;line-height:1.7;margin:0 0 32px">
            Dołączyłeś do społeczności GoodStim — ludzi, którzy biorą swój spokój w swoje ręce.
            Jako podziękowanie, oto Twój kod na <strong style="color:#252537">10% rabatu</strong>:
          </p>
          <div style="background:#f7fdf9;border:2px dashed #2AE5A5;padding:24px;border-radius:12px;text-align:center;margin-bottom:32px">
            <span style="font-size:32px;font-weight:800;color:#0057B8;letter-spacing:4px">PREMIERA10</span>
            <p style="color:#718096;font-size:13px;margin:8px 0 0">Ważny przez 30 dni · Wpisz przy kasie</p>
          </div>
          <div style="text-align:center;margin-bottom:32px">
            <a href="https://goodstim.pl/shop" style="display:inline-block;background:#0057B8;color:#ffffff;font-weight:700;font-size:14px;padding:16px 32px;border-radius:50px;text-decoration:none">
              Przejdź do sklepu
            </a>
          </div>
          <p style="color:#a0aec0;font-size:13px;text-align:center;margin:0">
            Pytania? <a href="mailto:hello@goodstim.pl" style="color:#2AE5A5">hello@goodstim.pl</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center">
          <p style="color:#a0aec0;font-size:12px;margin:0">
            © 2025 GoodStim ·
            <a href="https://goodstim.pl/unsubscribe?email=${encodeURIComponent(email)}" style="color:#a0aec0">Wypisz się</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
