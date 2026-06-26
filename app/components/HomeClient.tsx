"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Icon from "./Icon";
import UrgencyBanner from "./UrgencyBanner";
import ModesSection from "./ModesSection";
import BeforeAfterSection from "./BeforeAfterSection";
import CertsSection from "./CertsSection";
import FaqSection from "./FaqSection";
import { useState } from "react";

const BENEFITS = [
  { icon: "energy_savings_leaf", title: "Redukcja stresu", desc: "Obniża poziom kortyzolu i natychmiastowo aktywuje układ przywspółczulny, wyciszając reakcję walki lub ucieczki." },
  { icon: "bedtime", title: "Lepszy sen", desc: "Ułatwia zasypianie i pogłębia fazę REM, przygotowując mózg do regeneracji w nocy." },
  { icon: "monitor_heart", title: "Optymalizacja HRV", desc: "Trwale zwiększa zmienność rytmu zatokowego (HRV), co jest kluczowym markerem odporności psychofizycznej." },
];

const STEPS = [
  { num: "1", title: "Załóż urządzenie", desc: "Ergonomiczny kształt idealnie dopasowuje się do szyi, zapewniając bezpośredni kontakt z nerwem błędnym." },
  { num: "2", title: "Ustaw intensywność", desc: "Użyj aplikacji mobilnej, aby wybrać program dostosowany do Twoich potrzeb: od głębokiego snu po skupienie." },
  { num: "3", title: "Zrelaksuj się", desc: "Poczuj delikatne impulsy, które synchronizują Twój oddech i rytm serca w czasie rzeczywistym." },
];

const HERO_IMG = "/product.png";
const LIFESTYLE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCkPFGs-i4qzYjJFhlDeCvRD2RUGQJLoh_aAGB0RDBPH-JLRV48pNRoWZfaOeRZoLTBToutvx57Wsbi0o59FYYc5WvyGAn-coEjnUEHrnl57wuFflpfP5w885WIkNbjQ2blJVBFhscs6XzdVocM4KY6LqrQ3vcPJcoZexe5-uf4q2zRL8E_7Rf7X_1B2nQRPHTYCGSwsgPTY-uACamz1TbTnWd7aBKfv_GMn3nz--Lxf3gGCh3r0MYfalYBGoYLw-h-f96b9t7Lgw";

export default function HomeClient() {
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setNewsletterState("loading");
    try {
      const res = await fetch("/api/email/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setNewsletterState(res.ok ? "ok" : "error");
    } catch {
      setNewsletterState("error");
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans selection:bg-vibrant-teal selection:text-white">
      <Navbar />

      <main className="pt-20">
        <UrgencyBanner />

        {/* HERO */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden py-20 lg:py-0">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-mint rounded-full text-secondary text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-vibrant-teal pulse-teal flex-shrink-0" />
                Stymulator Nerwu Błędnego · Technologia VNS
              </div>
              <h1 className="font-montserrat text-[clamp(36px,5vw,48px)] leading-[1.16] font-bold tracking-[-0.02em] text-primary max-w-xl">
                Przejmij kontrolę nad swoim spokojem
              </h1>
              <p className="text-lg leading-7 text-on-surface-variant max-w-lg">
                GoodStim to zaawansowany stymulator nerwu błędnego, który przywraca równowagę układowi nerwowemu w zaledwie 15 minut dziennie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="/shop" className="px-8 py-4 bg-tech-blue text-white text-sm font-semibold tracking-wide rounded-lg hover:scale-[1.02] transition-all text-center btn-press">
                  Rozpocznij terapię
                </a>
                <a href="/the-science" className="px-8 py-4 border-2 border-tech-blue text-tech-blue text-sm font-semibold tracking-wide rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
                  <Icon name="play_circle" className="text-[20px]" />
                  Zobacz jak to działa
                </a>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-vibrant-teal/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-soft-mint transition-transform duration-700 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMG}
                  alt="Stymulator nerwu błędnego GoodStim VNS One"
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-32 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-20 space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Inwestycja w Twoją stabilność
              </h2>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
                Zaprojektowany, aby wspierać naturalną zdolność organizmu do regeneracji i adaptacji do stresu.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BENEFITS.map((b) => (
                <div key={b.title} className="bg-white p-10 rounded-[24px] border border-[#E5F6EF] shadow-[0px_4px_20px_rgba(37,37,55,0.04)] hover:shadow-xl transition-all group cursor-default">
                  <div className="w-14 h-14 bg-soft-mint rounded-2xl flex items-center justify-center mb-8 group-hover:bg-vibrant-teal transition-colors">
                    <Icon name={b.icon} className="text-vibrant-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-montserrat text-2xl font-semibold text-primary mb-4">{b.title}</h3>
                  <p className="text-base text-on-surface-variant">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ModesSection />
        <BeforeAfterSection />

        {/* HOW IT WORKS */}
        <section className="py-32 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative h-[600px] w-full bg-surface-container rounded-[40px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={LIFESTYLE_IMG}
                    alt="Osoba używająca stymulatora nerwu błędnego GoodStim"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-vibrant-teal rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="bolt" className="text-white" />
                      </div>
                      <div>
                        <div className="text-primary font-bold">Tryb Deep Relax</div>
                        <div className="text-primary/60 text-sm">Aktywny · 85% intensywności</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-12">
                <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                  3 proste kroki do równowagi
                </h2>
                <div className="space-y-8">
                  {STEPS.map((s) => (
                    <div key={s.num} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-tech-blue text-white rounded-full flex items-center justify-center font-bold text-lg">{s.num}</div>
                      <div>
                        <h4 className="font-montserrat text-xl font-semibold text-primary mb-2">{s.title}</h4>
                        <p className="text-on-surface-variant">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section id="reviews" className="py-24 bg-tech-blue text-white">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 mb-20">
              {["WIRED", "HEALTHLINE", "FORBES", "TECHCRUNCH"].map((b) => (
                <span key={b} className="font-bold text-xl tracking-widest">{b}</span>
              ))}
            </div>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Icon name="format_quote" className="text-vibrant-teal text-5xl" fill />
              <p className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] italic">
                &ldquo;GoodStim całkowicie odmienił moje podejście do zarządzania stresem. Jako CEO, często czułem się wypalony. Dzięki 15-minutowym sesjom wieczornym, mój sen jest głębszy, a poranki pełne energii.&rdquo;
              </p>
              <div className="pt-6">
                <div className="font-bold text-xl">Marek Wiśniewski</div>
                <div className="text-vibrant-teal text-sm font-semibold tracking-wide">Zweryfikowany klient · Biohacker</div>
              </div>
            </div>
          </div>
        </section>

        <CertsSection />
        <FaqSection />

        {/* NEWSLETTER */}
        <section className="py-32 bg-soft-mint relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Gotowy na nową jakość życia?
              </h2>
              <p className="text-lg leading-7 text-on-surface-variant">
                Dołącz do ponad 10,000 osób, które odzyskały spokój dzięki stymulacji nerwu błędnego GoodStim.
              </p>
              {newsletterState === "ok" ? (
                <div className="flex items-center justify-center gap-3 py-5 px-8 bg-vibrant-teal/20 rounded-xl max-w-lg mx-auto">
                  <span className="text-secondary font-bold text-lg">✓</span>
                  <p className="text-secondary font-semibold">Zapisano! Sprawdź skrzynkę — kod PREMIERA10 już czeka.</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Twoje email..."
                    required
                    disabled={newsletterState === "loading"}
                    className="flex-grow px-6 py-4 rounded-lg bg-white border-none outline-none focus:ring-2 focus:ring-vibrant-teal transition-all text-tech-blue placeholder:text-outline disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={newsletterState === "loading"}
                    className="px-8 py-4 bg-vibrant-teal text-tech-blue font-bold rounded-lg hover:scale-[1.02] transition-all whitespace-nowrap disabled:opacity-60"
                  >
                    {newsletterState === "loading" ? "Zapisuję..." : "Zapisz się"}
                  </button>
                </form>
              )}
              {newsletterState === "error" && (
                <p className="text-red-500 text-sm text-center">Coś poszło nie tak. Spróbuj ponownie.</p>
              )}
              <p className="text-xs text-on-surface-variant/60">Dołącz do newslettera i odbierz 10% rabatu na pierwsze zamówienie.</p>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-vibrant-teal/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-tech-blue/5 rounded-full blur-[80px] pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
