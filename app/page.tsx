import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";
import { REVIEWS, AGGREGATE_RATING } from "./lib/reviews";

export const metadata: Metadata = {
  title: "Stymulator Nerwu Błędnego GoodStim — Opinie i Efekty | tVNS",
  description:
    "GoodStim — stymulator nerwu błędnego (tVNS) do użytku domowego. Opinie użytkowników: 5,0/5. Mniej stresu, lepszy sen i wyższe HRV w 15 minut dziennie. Cena 550 zł, darmowa dostawa.",
  alternates: {
    canonical: "https://goodstim.pl",
  },
  keywords: [
    "stymulator nerwu błędnego",
    "stymulator nerwu błędnego opinie",
    "stymulator nerwu błędnego cena",
    "stymulacja nerwu błędnego",
    "urządzenie VNS",
    "tVNS",
    "biohacking",
    "redukcja stresu HRV",
  ],
  openGraph: {
    title: "Stymulator Nerwu Błędnego GoodStim — Opinie i Efekty",
    description:
      "Zaawansowany stymulator nerwu błędnego do użytku domowego. Ocena 5,0/5 od użytkowników. Mniej stresu, lepszy sen w 15 minut dziennie.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stymulator Nerwu Błędnego GoodStim — Opinie i Efekty",
    description:
      "Zaawansowany stymulator nerwu błędnego do użytku domowego. Ocena 5,0/5 od użytkowników. Mniej stresu, lepszy sen w 15 minut.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoodStim",
  description: "Stymulator nerwu błędnego do codziennego użytku domowego",
  url: "https://goodstim.pl",
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "GoodStim VNS One — Stymulator Nerwu Błędnego",
  image: "https://goodstim.pl/product.png",
  description:
    "Zaawansowany stymulator nerwu błędnego (tVNS) do codziennego użytku domowego. 4 tryby pracy, regulowana intensywność, aplikacja iOS/Android. Wspiera redukcję stresu, lepszy sen i wyższe HRV.",
  brand: { "@type": "Brand", name: "GoodStim" },
  sku: "GS-VNS-ONE-001",
  offers: {
    "@type": "Offer",
    url: "https://goodstim.pl/shop",
    priceCurrency: "PLN",
    price: "550.00",
    availability: "https://schema.org/InStock",
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
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5" },
    reviewBody: r.text,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
