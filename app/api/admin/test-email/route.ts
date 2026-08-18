import { NextResponse } from "next/server";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { adminOrderEmailHtml } from "../../stripe/webhook/route";
import { PRODUCTS, SHIPPING_FEE } from "../../../lib/products";

const resend = new Resend(process.env.RESEND_API_KEY);
const TEST_TOTAL = PRODUCTS.find((p) => p.id === "vns-one")!.price + SHIPPING_FEE;

async function isAuthed() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  if (!await isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
    to: "wojtekdymek95@gmail.com",
    subject: `💸 +${TEST_TOTAL.toFixed(2)} PLN — zamówienie #GS-TEST01 (TESTOWY)`,
    html: adminOrderEmailHtml({
      orderNumber: "GS-TEST01",
      customerName: "Jan Kowalski",
      customerEmail: "jan.kowalski@example.com",
      customerPhone: "501 234 567",
      deliveryMethod: "inpost",
      lockerPoint: "WAW98M",
      items: [{ name: "GoodStim VNS One", qty: 1 }],
      total: TEST_TOTAL,
    }),
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true, sent_to: "wojtekdymek95@gmail.com" });
}
