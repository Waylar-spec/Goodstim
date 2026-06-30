// Integracja z Fakturownią — automatyczne faktury/rachunki po opłaceniu zamówienia.
// Konfiguracja (env w Vercel):
//   FAKTUROWNIA_DOMAIN     — subdomena konta, np. "goodstim" dla goodstim.fakturownia.pl
//   FAKTUROWNIA_API_TOKEN  — token API (Ustawienia → API w panelu Fakturowni)
// Bez tych zmiennych funkcja nic nie robi (nie blokuje checkoutu).
//
// Firma zwolniona z VAT → każda pozycja ma stawkę "zw".

type InvoiceOrder = {
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  buyerTaxNo?: string; // NIP, gdy faktura na firmę
  items: { name: string; qty: number; price: number }[];
  total: number;
};

export async function createAndSendInvoice(order: InvoiceOrder): Promise<void> {
  const domain = process.env.FAKTUROWNIA_DOMAIN;
  const token = process.env.FAKTUROWNIA_API_TOKEN;
  if (!domain || !token) return; // nie skonfigurowano — pomiń

  const today = new Date().toISOString().slice(0, 10);

  const payload = {
    api_token: token,
    invoice: {
      kind: "vat",
      sell_date: today,
      issue_date: today,
      payment_to: today,
      payment_type: "transfer",
      status: "paid",
      paid: order.total.toFixed(2),
      buyer_name: order.buyerName || "Klient detaliczny",
      buyer_email: order.buyerEmail,
      ...(order.buyerTaxNo ? { buyer_tax_no: order.buyerTaxNo } : {}),
      description: `Zamówienie ${order.orderNumber}`,
      lang: "pl",
      positions: order.items.map((i) => ({
        name: i.name,
        tax: "zw", // zwolniony z VAT
        quantity: i.qty,
        price_gross: i.price.toFixed(2),
      })),
    },
  };

  try {
    const res = await fetch(`https://${domain}.fakturownia.pl/invoices.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Fakturownia create error:", res.status, await res.text());
      return;
    }
    const data = await res.json();
    const id = data?.id;
    if (!id) return;

    // Wyślij dokument mailem do klienta
    const sendRes = await fetch(
      `https://${domain}.fakturownia.pl/invoices/${id}/send_by_email.json?api_token=${encodeURIComponent(token)}`,
      { method: "POST" }
    );
    if (!sendRes.ok) {
      console.error("Fakturownia send error:", sendRes.status, await sendRes.text());
    }
  } catch (e) {
    console.error("Fakturownia error:", e);
  }
}
