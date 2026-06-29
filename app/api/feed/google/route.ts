import { NextResponse } from "next/server";

const BASE = "https://goodstim.pl";

const FEED_PRODUCTS = [
  {
    id: "vns-one",
    title: "GoodStim VNS One — Stymulator Nerwu Błędnego",
    description: "Zaawansowany stymulator nerwu błędnego (tVNS) do codziennego użytku. 4 tryby pracy, 50 poziomów intensywności 1–50 mA, aplikacja iOS/Android, bateria na 24h, materiał hipoalergiczny. Certyfikaty CE/FCC/RoHS. Darmowa dostawa InPost.",
    link: `${BASE}/shop`,
    image: `${BASE}/product.png`,
    price: "550.00 PLN",
    salePrice: "550.00 PLN",
    brand: "GoodStim",
    mpn: "GS-VNS-ONE-001",
    googleCategory: "491", // Health & Beauty > Health Care
    productType: "Urządzenia wellness > Stymulatory nerwu błędnego",
    availability: "in stock",
    condition: "new",
  },
  {
    id: "gel-2pack",
    title: "GoodStim Żel Przewodzący 2-pak (2×100ml)",
    description: "Żel przewodzący zoptymalizowany pod stymulację tVNS do urządzenia GoodStim VNS One. Zestaw 2 x 100 ml — zapas na ok. 2 miesiące codziennego użytkowania.",
    link: `${BASE}/shop`,
    image: `${BASE}/product.png`,
    price: "34.00 PLN",
    brand: "GoodStim",
    mpn: "GS-GEL-2PK",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    availability: "preorder",
    condition: "new",
  },
  {
    id: "gel-6pack",
    title: "GoodStim Żel Przewodzący 6-pak (6×100ml)",
    description: "Ekonomiczny zestaw żelu przewodzącego na 6 miesięcy codziennego użytkowania GoodStim VNS One. 6 x 100 ml. Oszczędzasz 13 zł vs 3 x 2-pak.",
    link: `${BASE}/shop`,
    image: `${BASE}/product.png`,
    price: "89.00 PLN",
    brand: "GoodStim",
    mpn: "GS-GEL-6PK",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    availability: "preorder",
    condition: "new",
  },
  {
    id: "electrodes",
    title: "GoodStim Elektrody Zapasowe (4 szt.)",
    description: "Wymienne elektrody ze stali nierdzewnej dedykowane do GoodStim VNS One. Zestaw 4 sztuk.",
    link: `${BASE}/shop`,
    image: `${BASE}/product.png`,
    price: "49.00 PLN",
    brand: "GoodStim",
    mpn: "GS-ELEC-4PK",
    googleCategory: "491",
    productType: "Urządzenia wellness > Akcesoria do stymulatorów",
    availability: "preorder",
    condition: "new",
  },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const items = FEED_PRODUCTS.map(p => `
    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.title)}</g:title>
      <g:description>${esc(p.description)}</g:description>
      <g:link>${esc(p.link)}</g:link>
      <g:image_link>${esc(p.image)}</g:image_link>
      <g:price>${p.price}</g:price>
      ${p.salePrice ? `<g:sale_price>${p.salePrice}</g:sale_price>` : ""}
      <g:availability>${p.availability}</g:availability>
      <g:condition>${p.condition}</g:condition>
      <g:brand>${esc(p.brand)}</g:brand>
      <g:mpn>${esc(p.mpn)}</g:mpn>
      <g:google_product_category>${p.googleCategory}</g:google_product_category>
      <g:product_type>${esc(p.productType)}</g:product_type>
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
    </item>`).join("\n");

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
