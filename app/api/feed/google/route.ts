import { NextResponse } from "next/server";
import { PRODUCTS, DEVICE_ADDITIONAL_ID } from "../../../lib/products";

const BASE = "https://goodstim.pl";

// Metadane specyficzne dla feedu (długi opis, kategoria Google, MPN, link) — cena i dostępność
// biorą się bezpośrednio z lib/products.ts (PRODUCTS), żeby feed nigdy nie rozjechał się ze stroną.
const FEED_META: Record<string, { description: string; mpn: string; googleCategory: string; productType: string; link: string }> = {
  "vns-one": {
    description: "Zaawansowany stymulator nerwu błędnego (tVNS) do codziennego użytku. 4 tryby pracy, 50 poziomów intensywności 1–50 mA, aplikacja iOS/Android, bateria na 24h, materiał hipoalergiczny. Certyfikaty CE/FCC/RoHS. Darmowa dostawa InPost.",
    mpn: "GS-VNS-ONE-001",
    googleCategory: "491", // Health & Beauty > Health Care
    productType: "Urządzenia wellness > Stymulatory nerwu błędnego",
    link: `${BASE}/shop`,
  },
  "travel-case": {
    description: "Wytrzymałe, twarde etui do bezpiecznego przechowywania i transportu GoodStim VNS One wraz z akcesoriami. Kompatybilne wyłącznie z GoodStim VNS One.",
    mpn: "GS-CASE-001",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    link: `${BASE}/shop/etui-podrozne`,
  },
  "gel-2pack": {
    description: "Żel przewodzący zoptymalizowany pod stymulację tVNS do urządzenia GoodStim VNS One. Zestaw 2 x 100 ml — zapas na ok. 2 miesiące codziennego użytkowania.",
    mpn: "GS-GEL-2PK",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    link: `${BASE}/shop`,
  },
  "gel-6pack": {
    description: "Ekonomiczny zestaw żelu przewodzącego na 6 miesięcy codziennego użytkowania GoodStim VNS One. 6 x 100 ml.",
    mpn: "GS-GEL-6PK",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    link: `${BASE}/shop`,
  },
};

// Do feedu trafiają tylko realnie kupowalne produkty — bez wariantu "dodatkowe urządzenie"
// (to tylko upsell w koszyku, nie osobny produkt) i bez comingSoon (Google i tak by je odrzucił).
const FEED_PRODUCTS = PRODUCTS.filter((p) => !p.comingSoon && p.id !== DEVICE_ADDITIONAL_ID && FEED_META[p.id]);

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const items = FEED_PRODUCTS.map((p) => {
    const meta = FEED_META[p.id];
    const price = `${p.price.toFixed(2)} PLN`;
    return `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.name)}${p.subtitle ? ` — ${esc(p.subtitle)}` : ""}</g:title>
      <g:description>${esc(meta.description)}</g:description>
      <g:link>${esc(meta.link)}</g:link>
      <g:image_link>${esc(BASE + p.image)}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>GoodStim</g:brand>
      <g:mpn>${esc(meta.mpn)}</g:mpn>
      <g:google_product_category>${meta.googleCategory}</g:google_product_category>
      <g:product_type>${esc(meta.productType)}</g:product_type>
      <g:shipping>
        <g:country>PL</g:country>
        <g:service>InPost Paczkomat</g:service>
        <g:price>0.00 PLN</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>PL</g:country>
        <g:service>InPost Kurier</g:service>
        <g:price>0.00 PLN</g:price>
      </g:shipping>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>GoodStim</title>
    <link>${BASE}</link>
    <description>GoodStim — Stymulatory Nerwu Błędnego</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=43200", // 12h cache
    },
  });
}
