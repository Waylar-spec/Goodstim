import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { getDb } from "../../../lib/db";
import { reviewRequestEmailHtml } from "../../cron/review-requests/route";

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_EMAIL = "wojtekdymek95@gmail.com";

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const token = crypto.randomUUID();

  await sql`
    INSERT INTO reviews (token, order_number, customer_name, customer_email, status)
    VALUES (${token}, 'GS-TEST01', 'Wojtek (test)', ${TEST_EMAIL}, 'pending_submission')
  `;

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://goodstim.pl";
  const reviewUrl = `${base}/review/${token}`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "GoodStim <kontakt@goodstim.pl>",
    to: TEST_EMAIL,
    subject: `Jak oceniasz GoodStim VNS One? ⭐ (TESTOWY)`,
    html: reviewRequestEmailHtml({ firstName: "Wojtek", orderNumber: "GS-TEST01", reviewUrl }),
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true, sent_to: TEST_EMAIL, reviewUrl });
}
