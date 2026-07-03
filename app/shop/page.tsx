import type { Metadata } from "next";
import ShopClient from "../components/ShopClient";
import { REVIEWS, AGGREGATE_RATING } from "../lib/reviews";

export const metadata: Metadata = {
  title: "Kup GoodStim VNS One — Stymulator Nerwu Błędnego · 550 PLN",
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
      "Profesjonalny stymulator nerwu błędnego. 50 poziomów intensywności, iOS/Android, bateria 24h. Od 550 PLN z darmową dostawą.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodStim VNS One — Stymulator Nerwu Błędnego",
    description:
      "Profesjonalny stymulator nerwu błędnego. 50 poziomów, iOS/Android. Od 550 PLN.",
  },
};

const productJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "GoodStim VNS One — Stymulator Nerwu Błędnego",
  description:
    "Profesjonalny stymulator nerwu błędnego (tVNS) do użytku domowego. 50 poziomów stymulacji 1–50 mA, kompatybilny z iOS i Android, bateria 24h, materiał hipoalergiczny klasy medycznej.",
  image: "https://goodstim.pl/product.png",
  brand: { "@type": "Brand", name: "GoodStim" },
  sku: "GS-VNS-ONE-001",
  category: "Urządzenia wellness / stymulacja nerwu błędnego",
  offers: {
    "@type": "Offer",
    priceCurrency: "PLN",
    price: "550",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "GoodStim" },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "PLN" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "d" },
        transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "d" },
      },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "PL" },
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: AGGREGATE_RATING.score.toFixed(1),
    reviewCount: String(AGGREGATE_RATING.count),
    bestRating: "5",
    worstRating: "1",
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5" },
    author: { "@type": "Person", name: r.name },
    reviewBody: r.text,
  })),
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
