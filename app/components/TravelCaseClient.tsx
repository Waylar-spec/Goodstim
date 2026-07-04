"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Icon from "./Icon";

const IMAGES = ["/case/1.avif", "/case/2.avif"];

const FAQS = [
  {
    q: "Czy etui jest wodoodporne?",
    a: "Etui ma twardą, odporną na wstrząsy skorupę, która chroni GoodStim VNS One przed zarysowaniami i uderzeniami. Nie jest to jednak etui wodoszczelne — zalecamy unikać zanurzania go w wodzie.",
  },
  {
    q: "Czy zmieszczą się w nim też akcesoria?",
    a: "Tak! Wnętrze etui pomieści GoodStim VNS One razem z kablem ładującym i żelem przewodzącym — wszystko w jednym, uporządkowanym miejscu.",
  },
  {
    q: "Jak trwałe jest etui?",
    a: "Twarda skorupa zapewnia solidną ochronę przed upadkami, zarysowaniami i drobnymi uderzeniami — idealne rozwiązanie do podróży i codziennego użytku.",
  },
  {
    q: "Jakie są wymiary i czy zmieści się do bagażu podręcznego?",
    a: "Etui ma kompaktowe wymiary 21 × 19 × 6 cm i dostępne jest w kolorze czarnym — bez problemu zmieści się w bagażu podręcznym, plecaku czy torbie.",
  },
  {
    q: "Jak się zamyka etui?",
    a: "Etui zamykane jest na wygodny zamek błyskawiczny, dzięki czemu Twój GoodStim jest bezpiecznie schowany, a jednocześnie łatwo dostępny w każdej chwili.",
  },
  {
    q: "Kiedy etui pojawi się w sprzedaży i ile będzie kosztować?",
    a: "Finalizujemy ostatnie szczegóły — dokładną cenę i datę premiery ogłosimy wkrótce. Zapisz się do newslettera powyżej, a dowiesz się o tym jako pierwsza/pierwszy.",
  },
] as const;

export default function TravelCaseClient() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setNewsletterState("loading");
    try {
      const res = await fetch("/api/email/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "travel-case-waitlist" }),
      });
      setNewsletterState(res.ok ? "ok" : "error");
    } catch {
      setNewsletterState("error");
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans selection:bg-vibrant-teal selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          {/* PRODUCT HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7 space-y-6">
              <div className="aspect-square bg-surface-container-low rounded-[24px] overflow-hidden border border-soft-mint relative group">
                <Image
                  src={IMAGES[activeThumb]}
                  alt="Etui podróżne GoodStim — widok główny"
                  fill
                  sizes="(max-width: 1024px) 90vw, 700px"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
                />
                <span className="absolute top-6 left-6 px-3 py-1.5 bg-on-surface-variant/80 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                  Wkrótce w sprzedaży
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {IMAGES.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all ${activeThumb === i ? "border-2 border-secondary" : "border border-outline-variant/30 hover:border-secondary"}`}
                  >
                    <Image
                      src={src}
                      alt={`Etui podróżne GoodStim — widok ${i + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover grayscale"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info card */}
            <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold tracking-wide rounded-full">WKRÓTCE W SPRZEDAŻY</span>
                <h1 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">Etui podróżne GoodStim</h1>
                <p className="text-lg leading-7 text-on-surface-variant">Kompaktowe, wytrzymałe etui do bezpiecznego przechowywania i transportu Twojego GoodStim VNS One oraz akcesoriów.</p>
              </div>

              <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[24px] shadow-sm space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat text-2xl font-bold text-on-surface-variant/60">Cena i data premiery — wkrótce</span>
                </div>
                <div className="space-y-4">
                  <button
                    disabled
                    className="w-full py-5 rounded-full font-semibold text-sm tracking-wide text-center flex items-center justify-center gap-2 bg-surface-container text-on-surface-variant cursor-default"
                  >
                    <Icon name="schedule" className="text-[20px]" />
                    Wkrótce dostępne
                  </button>

                  <div className="pt-2 space-y-3">
                    <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                      Bądź na bieżąco — dołącz do newslettera, a odezwiemy się w dniu premiery.
                    </p>
                    {newsletterState === "ok" ? (
                      <div className="flex items-center justify-center gap-2 py-3.5 px-4 bg-soft-mint rounded-xl">
                        <Icon name="check_circle" className="text-secondary text-[18px]" fill />
                        <p className="text-secondary font-semibold text-xs">Zapisano! Damy Ci znać jako pierwszej/-emu.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Twój adres e-mail"
                          required
                          disabled={newsletterState === "loading"}
                          className="flex-grow px-4 py-3 rounded-full border border-outline-variant/30 bg-white text-sm outline-none focus:ring-2 focus:ring-vibrant-teal transition-all placeholder:text-outline disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={newsletterState === "loading"}
                          className="px-5 py-3 bg-tech-blue text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors whitespace-nowrap disabled:opacity-60"
                        >
                          {newsletterState === "loading" ? "Zapisuję…" : "Powiadom mnie"}
                        </button>
                      </form>
                    )}
                    {newsletterState === "error" && (
                      <p className="text-error text-xs text-center">Coś poszło nie tak. Spróbuj ponownie.</p>
                    )}
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/20 grid grid-cols-2 gap-4">
                  {[
                    { icon: "shield", label: "Twarda obudowa" },
                    { icon: "cable", label: "Miejsce na kabel" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <Icon name={f.icon} className="text-on-surface-variant" />
                      </div>
                      <span className="text-xs font-semibold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-montserrat text-xl font-semibold text-primary">Co wiemy już teraz</h3>
                {[
                  { label: "Kompatybilność", value: "GoodStim VNS One i akcesoria" },
                  { label: "Zastosowanie", value: "Ochrona w podróży i codziennym transporcie" },
                  { label: "Wymiary", value: "21 × 19 × 6 cm" },
                  { label: "Kolor", value: "Czarny" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-3 border-b border-outline-variant/10">
                    <span className="text-base text-on-surface-variant">{row.label}</span>
                    <span className="text-sm font-semibold text-right max-w-[180px]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <section className="mt-40 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Najczęstsze pytania
              </h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
                Chcesz wiedzieć więcej? Napisz do nas w każdej chwili —{" "}
                <a href="mailto:kontakt@goodstim.pl" className="text-secondary font-semibold hover:underline">
                  kontakt@goodstim.pl
                </a>{" "}
                a na pewno się odezwiemy.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-[16px] border overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? "border-secondary bg-soft-mint"
                        : "border-outline-variant/20 bg-white hover:border-outline-variant/50"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-semibold text-base leading-snug ${
                          isOpen ? "text-secondary" : "text-primary"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant"
                        }`}
                      >
                        <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6">
                        <p className="text-base text-on-surface-variant leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* BACK TO SHOP */}
          <section className="mt-40 text-center space-y-6">
            <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-primary">Nie chcesz czekać?</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">GoodStim VNS One jest już dostępny w sprzedaży — etui to dodatek, który dołączy do oferty wkrótce.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-colors"
            >
              Zobacz GoodStim VNS One
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
