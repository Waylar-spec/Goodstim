import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FaqSection from "../components/FaqSection";
import { FAQS } from "../lib/faq";

export const metadata: Metadata = {
  title: "FAQ — Najczęstsze pytania o GoodStim",
  description:
    "Odpowiedzi na najczęstsze pytania o stymulator nerwu błędnego GoodStim: bezpieczeństwo, certyfikaty, sesje, ładowanie baterii i politykę zwrotów.",
  openGraph: {
    title: "FAQ — Najczęstsze pytania o GoodStim",
    description: "Odpowiedzi na najczęstsze pytania o stymulator nerwu błędnego GoodStim.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <Navbar />
      <main className="pt-20">
        <FaqSection />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
