"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { TIERS } from "../lib/affiliate";

const HERO_IMG = "/product.png";

const VALUE_PROPS = [
  {
    icon: "trending_up",
    title: "Rosnąca prowizja",
    desc: "Zaczynasz od 10% i rośniesz razem ze sprzedażą aż do 25% na poziomie Diamond. Raz zdobyty poziom zostaje na zawsze — nie spada.",
  },
  {
    icon: "payments",
    title: "Wysoka wartość zamówienia",
    desc: "GoodStim kosztuje 550 zł — jedna sprzedaż to od 55 zł do 137,50 zł prowizji, zależnie od Twojego poziomu. Znacznie więcej niż przy tanich produktach.",
  },
  {
    icon: "spa",
    title: "Produkt, który się broni sam",
    desc: "Stymulator nerwu błędnego (tVNS) to rosnąca kategoria biohackingu i wellness — realna technologia, nie kolejny suplement bez dowodów.",
  },
  {
    icon: "local_offer",
    title: "Podwójna korzyść dla Ciebie",
    desc: "Twój kod to jednocześnie link śledzący i rabat -10% dla klienta. Łatwiej namówić do zakupu, gdy masz czym przekonać.",
  },
];

const STEPS = [
  { num: "1", title: "Zarejestruj się", desc: "Podaj imię i email w formularzu poniżej. Możesz od razu wybrać własny, łatwy do zapamiętania kod." },
  { num: "2", title: "Odbierz link i kod", desc: "Mailem dostajesz link do panelu, swój unikalny link polecający i kod rabatowy — gotowe w minutę." },
  { num: "3", title: "Udostępniaj", desc: "Social media, znajomi, społeczność — gdziekolwiek dotrzesz do ludzi zainteresowanych redukcją stresu i lepszym snem." },
  { num: "4", title: "Zarabiaj", desc: "Prowizja nalicza się automatycznie przy każdej sprzedaży. Wypłatę zgłaszasz od 150 zł zebranej kwoty, przelewem na Twoje konto." },
];

const FAQS = [
  {
    q: "Jak dołączyć do programu?",
    a: "Wypełnij formularz na tej stronie — imię, email i (opcjonalnie) własny kod. Od razu po rejestracji dostaniesz mailem link do panelu afilianta oraz swój unikalny link i kod rabatowy.",
  },
  {
    q: "Kiedy i jak dostanę wypłatę?",
    a: "Prowizja gromadzi się na Twoim koncie w miarę sprzedaży — widzisz to na bieżąco w panelu afilianta. Gdy zbierzesz min. 150 zł, zgłaszasz się po wypłatę, a my przelewamy pieniądze na konto które podasz w panelu.",
  },
  {
    q: "Czy klient dostaje jakąś korzyść z mojego kodu?",
    a: "Tak — Twój kod działa jednocześnie jako link śledzący i kod rabatowy dający 10% zniżki. To ułatwia przekonanie kogoś do zakupu, bo oferujesz realną wartość, nie tylko polecenie.",
  },
  {
    q: "Czy mój poziom prowizji może spaść?",
    a: "Nie. Poziomy (Start → Silver → Gold → Diamond) liczone są ze skumulowanej sprzedaży od początku współpracy i rosną tylko w górę — nigdy nie tracisz osiągniętego statusu.",
  },
  {
    q: "Na jakim obszarze mogę promować GoodStim?",
    a: "Sklep obsługuje obecnie tylko Polskę (dostawa InPost), więc najlepiej działają polecenia trafiające do polskich odbiorców.",
  },
  {
    q: "Czy mogę stracić dostęp do programu?",
    a: "Konta bez żadnej sprzedaży mogą zostać usunięte porządkowo. Jeśli sprzedałeś(-aś) choć raz, Twoje konto i historia zarobków są bezpieczne — nawet jeśli aktywność na jakiś czas spadnie.",
  },
] as const;

export default function AffiliatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, code }),
      });

      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Coś poszło nie tak");
        setState("error");
      }
    } catch {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans">
      <Navbar />

      <main className="pt-20">
        {/* HERO */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-soft-mint rounded-full text-secondary text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-vibrant-teal pulse-teal flex-shrink-0" />
                Program Partnerski GoodStim
              </div>
              <h1 className="font-montserrat text-[clamp(32px,5vw,48px)] leading-[1.14] font-bold tracking-[-0.02em] text-primary max-w-xl">
                Zarabiaj, polecając technologię, w którą sam(a) wierzysz
              </h1>
              <p className="text-lg leading-7 text-on-surface-variant max-w-lg">
                Dołącz do programu partnerskiego GoodStim. Dostajesz unikalny link i kod rabatowy — za każdą sprzedaż z Twojego polecenia otrzymujesz prowizję od 10% do 25%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="#dolacz" className="px-8 py-4 bg-tech-blue text-white text-sm font-semibold tracking-wide rounded-lg hover:scale-[1.02] transition-all text-center btn-press">
                  Dołącz do programu
                </a>
                <a href="#jak-to-dziala" className="px-8 py-4 border-2 border-tech-blue text-tech-blue text-sm font-semibold tracking-wide rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
                  Zobacz jak to działa
                </a>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-vibrant-teal/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-soft-mint transition-transform duration-700 group-hover:scale-105">
                <Image
                  src={HERO_IMG}
                  alt="GoodStim VNS One — stymulator nerwu błędnego"
                  width={1024}
                  height={1024}
                  sizes="(max-width: 1024px) 90vw, 500px"
                  priority
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="py-24 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Dlaczego warto zostać partnerem GoodStim?
              </h2>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
                Prosty, przejrzysty program bez ukrytych warunków.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VALUE_PROPS.map((v) => (
                <div key={v.title} className="bg-white p-10 rounded-[24px] border border-[#E5F6EF] shadow-[0px_4px_20px_rgba(37,37,55,0.04)] hover:shadow-xl transition-all group cursor-default">
                  <div className="w-14 h-14 bg-soft-mint rounded-2xl flex items-center justify-center mb-6 group-hover:bg-vibrant-teal transition-colors">
                    <Icon name={v.icon} className="text-vibrant-teal group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-montserrat text-xl font-semibold text-primary mb-3">{v.title}</h3>
                  <p className="text-base text-on-surface-variant">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIERS */}
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Poziomy prowizji
              </h2>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
                Im więcej sprzedasz, tym wyższy procent — a raz zdobyty poziom zostaje na zawsze.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {TIERS.map((t, i) => (
                <div key={t.name} className="bg-white p-6 rounded-[24px] border border-[#E5F6EF] shadow-[0px_4px_20px_rgba(37,37,55,0.04)] text-center">
                  <div className="w-12 h-12 bg-soft-mint rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon name={["military_tech", "military_tech", "military_tech", "diamond"][i]} className="text-vibrant-teal" />
                  </div>
                  <p className="font-montserrat font-semibold text-primary mb-1">{t.name}</p>
                  <p className="text-3xl font-black text-secondary mb-2">{(t.rate * 100).toFixed(0)}%</p>
                  <p className="text-xs text-on-surface-variant">{t.minUnits === 0 ? "od startu" : `od ${t.minUnits} szt.`}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-on-surface-variant text-sm mt-8">
              Przy cenie 550 zł: Start = 55 zł/sprzedaż, Diamond = 137,50 zł/sprzedaż.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-surface-container-lowest" id="jak-to-dziala">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Jak zostać partnerem — 4 kroki
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {STEPS.map((s) => (
                <div key={s.num} className="text-center">
                  <div className="w-16 h-16 bg-tech-blue text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-montserrat text-2xl font-bold">
                    {s.num}
                  </div>
                  <h3 className="font-montserrat text-lg font-semibold text-primary mb-2">{s.title}</h3>
                  <p className="text-sm text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
                Pytania od partnerów
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-[16px] border overflow-hidden transition-all duration-200 ${
                      isOpen ? "border-secondary bg-soft-mint" : "border-outline-variant/20 bg-white hover:border-outline-variant/50"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className={`font-semibold text-base leading-snug ${isOpen ? "text-secondary" : "text-primary"}`}>
                        {faq.q}
                      </span>
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant"}`}>
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
          </div>
        </section>

        {/* REGISTRATION FORM */}
        <section className="py-24 bg-surface-container-lowest" id="dolacz">
          <div className="max-w-lg mx-auto px-6">
            <div className="bg-white rounded-[24px] border border-[#E5F6EF] shadow-[0px_4px_20px_rgba(37,37,55,0.04)] p-10">
              {state === "done" ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-soft-mint rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon name="mark_email_read" className="text-vibrant-teal text-[28px]" />
                  </div>
                  <h2 className="font-montserrat text-xl font-semibold text-primary mb-2">Sprawdź skrzynkę!</h2>
                  <p className="text-on-surface-variant text-sm">Wysłaliśmy Ci link do panelu afilianta wraz z Twoim unikalnym linkiem polecającym i kodem rabatowym.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-montserrat text-2xl font-semibold text-primary text-center mb-2">Dołącz teraz</h2>
                  <p className="text-center text-on-surface-variant text-sm mb-2">Rejestracja zajmuje minutę — zaczynasz zarabiać od razu.</p>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Imię i nazwisko</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-vibrant-teal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-vibrant-teal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Twój kod (opcjonalnie)</label>
                    <input
                      type="text"
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                      placeholder="np. TWOJEIMIE"
                      maxLength={20}
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-vibrant-teal transition-colors tracking-widest"
                    />
                    <p className="text-xs text-on-surface-variant mt-1.5">Zostaw puste, a wygenerujemy kod z Twojego imienia. Ten kod będą podawać ludzie w koszyku.</p>
                  </div>
                  {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full bg-tech-blue hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 text-white font-semibold py-4 rounded-xl transition-all text-base btn-press"
                  >
                    {state === "loading" ? "Rejestrowanie..." : "Zostań partnerem →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
