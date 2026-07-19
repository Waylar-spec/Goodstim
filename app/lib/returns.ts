import { getDb } from "./db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "wojtekdymek95@gmail.com";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { first_name: parts[0] ?? fullName, last_name: parts.slice(1).join(" ") || parts[0] || fullName };
}

function customerConfirmationHtml(orderNumber: string, firstName: string) {
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
          <h1 style="font-size:24px;font-weight:700;color:#252537;margin:0 0 8px">Zgłoszenie zwrotu przyjęte</h1>
          <p style="color:#718096;font-size:15px;margin:0 0 24px;line-height:1.6">
            Hej ${firstName}! Otrzymaliśmy Twoje zgłoszenie zwrotu dla zamówienia <strong style="color:#252537">#${orderNumber}</strong>.
          </p>
          <div style="background:#f7fdf9;border:2px solid #2AE5A5;border-radius:16px;padding:24px;margin-bottom:24px">
            <p style="margin:0;color:#4A5568;font-size:14px;line-height:1.6">
              📦 Przygotowujemy dla Ciebie darmową etykietę zwrotną InPost — dostaniesz ją w osobnym mailu (zwykle w ciągu kilku minut, czasem do 1 dnia roboczego). Wystarczy nadać paczkę w dowolnym Paczkomacie.
            </p>
          </div>
          <p style="color:#a0aec0;font-size:13px;text-align:center;margin:0">
            Pytania? <a href="mailto:kontakt@goodstim.pl" style="color:#2AE5A5">kontakt@goodstim.pl</a>
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;text-align:center">
          <p style="color:#a0aec0;font-size:12px;margin:0">© 2026 GoodStim</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
};

// Tworzy przesyłkę zwrotną InPost (jeśli skonfigurowana), zapisuje zgłoszenie w return_requests
// i wysyła maile do klienta i admina. Używane zarówno przez publiczny formularz /zwroty, jak i
// ręczne zgłoszenie z panelu admina (np. wyjątek poza oknem zwrotu).
export async function processReturnRequest(order: OrderRow, reason: string) {
  const sql = getDb();

  let shipmentId: string | null = null;
  const token = process.env.INPOST_SHIPX_TOKEN;
  const orgId = process.env.INPOST_ORG_ID ?? "79889";
  const returnLocker = process.env.INPOST_RETURN_LOCKER;
  const businessPhone = process.env.BUSINESS_PHONE;

  if (token && returnLocker && businessPhone) {
    try {
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
        custom_attributes: {
          target_point: returnLocker,
          sending_method: "parcel_locker",
        },
        reference: `ZWROT-${order.order_number}`,
        comments: `Zwrot zamówienia ${order.order_number}`,
      };

      const res = await fetch(`https://api-shipx-pl.easypack24.net/v1/organizations/${orgId}/shipments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) shipmentId = String(data.id ?? "");
      else console.error("InPost return shipment error:", data);
    } catch (err) {
      console.error("InPost return shipment error:", err);
    }
  }

  const [returnRequest] = await sql`
    INSERT INTO return_requests (order_id, order_number, customer_email, reason, shipment_id, status)
    VALUES (${order.id}, ${order.order_number}, ${order.customer_email}, ${reason}, ${shipmentId}, 'requested')
    RETURNING id
  `;

  const firstName = (order.customer_name ?? "Kliencie").split(" ")[0];

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
    to: order.customer_email,
    subject: `Zgłoszenie zwrotu — zamówienie #${order.order_number}`,
    html: customerConfirmationHtml(order.order_number, firstName),
  }).catch(e => console.error("Customer return confirmation email error:", e));

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "GoodStim <onboarding@resend.dev>",
    to: ADMIN_EMAIL,
    subject: `↩️ Nowe zgłoszenie zwrotu — #${order.order_number}`,
    html: `<p>Zamówienie: <strong>${order.order_number}</strong></p><p>Klient: ${order.customer_name} (${order.customer_email})</p><p>Powód: ${reason}</p><p>${shipmentId ? "Etykieta zwrotna w trakcie przygotowania (InPost)." : "Etykieta NIE została utworzona automatycznie — sprawdź konfigurację (INPOST_RETURN_LOCKER / BUSINESS_PHONE) i obsłuż ręcznie w panelu admina."}</p>`,
  }).catch(e => console.error("Admin return notification email error:", e));

  return { id: returnRequest.id as number, shipmentId };
}
