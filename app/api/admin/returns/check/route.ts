import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "wojtekdymek95@gmail.com";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("gs_admin")?.value === process.env.ADMIN_PASSWORD;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { first_name: parts[0] ?? fullName, last_name: parts.slice(1).join(" ") || parts[0] || fullName };
}

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const sql = getDb();
  const [ret] = await sql`SELECT * FROM return_requests WHERE id = ${id}`;
  if (!ret) return NextResponse.json({ error: "Brak zgłoszenia" }, { status: 404 });

  const token = process.env.INPOST_SHIPX_TOKEN;
  const orgId = process.env.INPOST_ORG_ID ?? "79889";
  if (!token) return NextResponse.json({ error: "Brak INPOST_SHIPX_TOKEN" }, { status: 500 });

  let shipmentId = ret.shipment_id as string | null;

  // Etykieta nie została utworzona przy zgłoszeniu (np. brak konfiguracji w tamtym momencie) — spróbuj teraz.
  if (!shipmentId) {
    const returnLocker = process.env.INPOST_RETURN_LOCKER;
    const businessPhone = process.env.BUSINESS_PHONE;
    if (!returnLocker || !businessPhone) {
      return NextResponse.json({ error: "Brak INPOST_RETURN_LOCKER lub BUSINESS_PHONE w konfiguracji — ustaw je i spróbuj ponownie." }, { status: 500 });
    }
    const [order] = await sql`SELECT * FROM orders WHERE id = ${ret.order_id}`;
    if (!order) return NextResponse.json({ error: "Brak powiązanego zamówienia" }, { status: 404 });

    const payload = {
      sender: {
        name: order.customer_name,
        ...splitName(order.customer_name ?? ""),
        email: order.customer_email,
        phone: order.customer_phone ?? "",
      },
      receiver: {
        name: "GoodStim Zwroty",
        first_name: "GoodStim",
        last_name: "Zwroty",
        email: ADMIN_EMAIL,
        phone: businessPhone,
      },
      parcels: [{ dimensions: { length: 380, width: 640, height: 80, unit: "mm" }, weight: { amount: 0.5, unit: "kg" } }],
      service: "inpost_locker_standard",
      custom_attributes: { target_point: returnLocker, sending_method: "parcel_locker" },
      reference: `ZWROT-${order.order_number}`,
      comments: `Zwrot zamówienia ${order.order_number}`,
    };

    const createRes = await fetch(`https://api-shipx-pl.easypack24.net/v1/organizations/${orgId}/shipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const createData = await createRes.json();
    if (!createRes.ok) {
      return NextResponse.json({ error: createData.message ?? "Błąd tworzenia etykiety InPost", detail: createData }, { status: 502 });
    }
    shipmentId = String(createData.id ?? "");
    await sql`UPDATE return_requests SET shipment_id = ${shipmentId}, updated_at = NOW() WHERE id = ${id}`;
  }

  const res = await fetch(`https://api-shipx-pl.easypack24.net/v1/shipments/${shipmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data.message ?? "Błąd InPost API", detail: data }, { status: 502 });

  const unavailableReasons = (data.offers ?? [])
    .flatMap((o: { unavailability_reasons?: { message: string }[] }) => o.unavailability_reasons ?? [])
    .map((r: { message: string }) => r.message);

  if (!data.tracking_number) {
    return NextResponse.json({ ok: true, ready: false, shipment_status: data.status, unavailable_reasons: unavailableReasons });
  }

  if (ret.status === "requested") {
    const labelRes = await fetch(`https://api-shipx-pl.easypack24.net/v1/shipments/${shipmentId}/label?format=Pdf&type=A6`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
    });

    if (!labelRes.ok) {
      return NextResponse.json({ ok: true, ready: false, shipment_status: data.status, tracking_number: data.tracking_number, note: "Numer śledzenia gotowy, ale PDF etykiety jeszcze się generuje — spróbuj ponownie za chwilę." });
    }

    const pdfBuffer = Buffer.from(await labelRes.arrayBuffer());

    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
      to: ret.customer_email,
      subject: `Twoja etykieta zwrotna — zamówienie #${ret.order_number}`,
      html: `<p>Cześć! W załączniku znajdziesz etykietę zwrotną do wydruku dla zamówienia <strong>#${ret.order_number}</strong>.</p><p>Numer śledzenia: <strong>${data.tracking_number}</strong></p><p>Wystarczy nadać paczkę w dowolnym Paczkomacie InPost — skanując kod z etykiety.</p><p>Pytania? kontakt@goodstim.pl</p>`,
      attachments: [{ filename: `etykieta-zwrotu-${ret.order_number}.pdf`, content: pdfBuffer }],
    });

    await sql`UPDATE return_requests SET tracking_number = ${data.tracking_number}, status = 'label_sent', updated_at = NOW() WHERE id = ${id}`;
  }

  return NextResponse.json({ ok: true, ready: true, tracking_number: data.tracking_number, shipment_status: data.status });
}
