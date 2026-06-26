import type { Metadata } from "next";
import ShopClient from "../components/ShopClient";

export const metadata: Metadata = {
  title: "Kup GoodStim VNS One — Stymulator Nerwu Błędnego · 1299 PLN",
  description:
    "GoodStim VNS One to profesjonalny stymulator nerwu błędnego z 50 poziomami intensywności. iOS i Android. Darmowa dostawa, 30 dni gwarancji zwrotu. Sprawdź cenę.",
  keywords: [
    "stymulator nerwu błędnego cena",
    "kup urządzenie VNS",
    "goodstim VNS one",
    "stymulacja nerwu błędnego sklep",
    "tVNS urządzenie",
  ],
  openGraph: {
    title: "GoodStim VNS One — Stymulator Nerwu Błędnego",
    description:
      "Profesjonalny stymulator nerwu błędnego. 50 poziomów intensywności, iOS/Android, bateria 24h. Od 1299 PLN z darmową dostawą.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodStim VNS One — Stymulator Nerwu Błędnego",
    description:
      "Profesjonalny stymulator nerwu błędnego. 50 poziomów, iOS/Android. Od 1299 PLN.",
  },
};

const productJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "GoodStim VNS One — Stymulator Nerwu Błędnego",
  description:
    "Profesjonalny stymulator nerwu błędnego (tVNS) do użytku domowego. 50 poziomów stymulacji 1–50 mA, kompatybilny z iOS i Android, bateria 24h, materiał hipoalergiczny klasy medycznej.",
  brand: { "@type": "Brand", name: "GoodStim" },
  sku: "GS-VNS-ONE-001",
  category: "Urządzenia wellness / stymulacja nerwu błędnego",
  offers: {
    "@type": "Offer",
    priceCurrency: "PLN",
    price: "1299",
    priceValidUntil: "2025-12-31",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "GoodStim" },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "PLN" },
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    bestRating: "5",
    reviewCount: "2450",
  },
  review: [
    {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      author: { "@type": "Person", name: "Marek K." },
      reviewBody:
        "Moja jakość snu poprawiła się diametralnie. Wstaję wypoczęty, a stres w pracy nie jest już tak obciążający.",
    },
    {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
      author: { "@type": "Person", name: "Piotr L." },
      reviewBody:
        "Najlepsza inwestycja w zdrowie psychiczne. Jako biohacker testowałem wiele urządzeń, ale to jest klasa sama w sobie.",
    },
  ],
};

export default function ShopPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ShopClient />
    </>
  );
}
