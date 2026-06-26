import type { Metadata } from "next";
import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title: "GoodStim — Stymulator Nerwu Błędnego | Terapia VNS w domu",
  description:
    "GoodStim to zaawansowany stymulator nerwu błędnego (VNS) do codziennego użytku. Redukuj stres, popraw sen i optymalizuj HRV w zaledwie 15 minut dziennie. Zamów teraz.",
  keywords: [
    "stymulator nerwu błędnego",
    "stymulacja nerwu błędnego",
    "urządzenie VNS",
    "terapia nerwem błędnym",
    "tVNS",
    "biohacking",
    "redukcja stresu HRV",
  ],
  openGraph: {
    title: "GoodStim — Stymulator Nerwu Błędnego",
    description:
      "Zaawansowany stymulator nerwu błędnego do codziennego użytku. Redukuj stres i popraw sen w 15 minut.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodStim — Stymulator Nerwu Błędnego",
    description:
      "Zaawansowany stymulator nerwu błędnego do codziennego użytku. Redukuj stres i popraw sen w 15 minut.",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoodStim",
  description: "Stymulator nerwu błędnego do codziennego użytku domowego",
  url: "https://goodstim.pl",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
