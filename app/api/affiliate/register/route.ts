import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { genAffiliateCode } from "../../../lib/affiliate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Podaj imię i email" }, { status: 400 });
  }

  const sql = getDb();
  const existing = await sql`SELECT token FROM affiliates WHERE email = ${email.trim().toLowerCase()}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "Ten email jest już zarejestrowany w programie" }, { status: 409 });
  }

  let code = genAffiliateCode(name);
  // Unikalność kodu — dolosuj ponownie w razie kolizji
  for (let i = 0; i < 5; i++) {
    const clash = await sql`SELECT id FROM affiliates WHERE code = ${code}`;
    if (clash.length === 0) break;
    code = genAffiliateCode(name);
  }

  const token = crypto.randomUUID();

  await sql`
    INSERT INTO affiliates (code, token, name, email)
    VALUES (${code}, ${token}, ${name.trim()}, ${email.trim().toLowerCase()})
  `;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://goodstim.pl";
  const panelUrl = `${base}/affiliate/panel/${token}`;
  const refUrl = `${base}/?ref=${code}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "GoodStim <kontakt@goodstim.pl>",
    to: email.trim(),
    subject: "Witaj w programie afiliacyjnym GoodStim! 🎉",
    html: `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#0d2137 0%,#0a3d2e 100%);padding:40px;text-align:center">
<p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#2AE5A5;letter-spacing:3px;text-transform:uppercase">GoodStim Partner</p>
<p style="margin:0;font-size:48px">🚀</p>
<h1 style="margin:12px 0 0;font-size:24px;font-weight:800;color:#ffffff">Witaj, ${name.split(" ")[0]}!</h1>
</td></tr>
<tr><td style="padding:36px 40px">
<p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6">Twoje konto w programie afiliacyjnym GoodStim jest aktywne. Zaczynasz na poziomie <strong>Start (10%)</strong> i rośniesz wraz ze sprzedażą — do 25% na poziomie Diamond.</p>
<div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;margin-bottom:12px">
<p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Twój link polecający</p>
<p style="margin:0;font-size:14px;color:#0d1524;font-weight:600;word-break:break-all">${refUrl}</p>
</div>
<div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;margin-bottom:20px">
<p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Twój kod rabatowy (do wpisania w koszyku)</p>
<p style="margin:0;font-size:20px;color:#0d1524;font-weight:800;letter-spacing:1px">${code}</p>
<p style="margin:4px 0 0;font-size:13px;color:#64748b">Osoby, które go użyją, dostają 10% zniżki — a sprzedaż i tak jest zaliczana Tobie.</p>
</div>
<div style="text-align:center;margin:28px 0">
<a href="${panelUrl}" style="display:inline-block;background:#2AE5A5;color:#0d1524;font-weight:800;font-size:16px;padding:16px 36px;border-radius:50px;text-decoration:none">Otwórz panel afilianta →</a>
</div>
<p style="margin:0;font-size:13px;color:#94a3b8;text-align:center">Zapisz ten link do panelu — to Twój jedyny dostęp do statystyk i zarobków.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`,
  });

  return NextResponse.json({ ok: true, code, panelUrl });
}
