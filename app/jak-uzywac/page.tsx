import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import ModesSection from "../components/ModesSection";
import TroubleshootingAccordion from "../components/TroubleshootingAccordion";

export const metadata: Metadata = {
  title: "Jak używać GoodStim — Instrukcja krok po kroku",
  description:
    "Kompletny przewodnik po GoodStim VNS One: jak nałożyć żel, założyć urządzenie, wybrać tryb i o nie dbać. Środki ostrożności i rozwiązywanie typowych problemów.",
  keywords: [
    "jak używać GoodStim",
    "instrukcja stymulatora nerwu błędnego",
    "GoodStim instrukcja obsługi",
    "jak założyć stymulator nerwu błędnego",
  ],
  openGraph: {
    title: "Jak używać GoodStim — Instrukcja krok po kroku",
    description: "Od rozpakowania do pierwszej sesji — kompletny przewodnik po GoodStim VNS One.",
    type: "article",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
};

const STEPS = [
  {
    n: "1",
    icon: "water_drop",
    title: "Nałóż żel",
    desc: "Nanieś niewielką ilość żelu przewodzącego na obie elektrody urządzenia. Poprawia kontakt ze skórą i komfort całej sesji.",
  },
  {
    n: "2",
    icon: "sensors",
    title: "Załóż na szyję",
    desc: "Ergonomiczny kształt dopasowuje się do szyi — elektrody powinny stykać się ze skórą po obu jej stronach, tam gdzie wyczuwalny jest puls.",
  },
  {
    n: "3",
    icon: "tune",
    title: "Wybierz tryb",
    desc: "Pilotem w zestawie albo w aplikacji wybierz program dopasowany do potrzeby: Relaksację, Sen, Skupienie lub Regenerację.",
  },
  {
    n: "4",
    icon: "self_improvement",
    title: "Zrelaksuj się",
    desc: "Sesja trwa 20 minut i kończy się automatycznie. Poczuj delikatne impulsy synchronizujące oddech i tętno.",
  },
] as const;

const BOX_CONTENTS = [
  { icon: "settings_input_antenna", label: "GoodStim VNS One", desc: "Główny moduł stymulatora" },
  { icon: "settings_remote", label: "Pilot", desc: "Szybka zmiana trybów bez telefonu" },
  { icon: "charging_station", label: "Stacja ładująca", desc: "Magnetyczne ładowanie USB-C" },
  { icon: "water_drop", label: "Żel przewodzący", desc: "Buteleczka na start" },
] as const;

const ROUTINE = [
  { icon: "psychology", time: "Rano", mode: "Skupienie", desc: "Krótka sesja przed pracą pomaga wejść w dzień ze spokojną głową, bez sięgania po kolejną kawę." },
  { icon: "fitness_center", time: "Po treningu", mode: "Regeneracja", desc: "Wspiera powrót do równowagi po wysiłku, zanim organizm przejdzie do reszty dnia." },
  { icon: "bedtime", time: "Wieczorem", mode: "Sen", desc: "Sesja 30–60 minut przed snem ułatwia wyciszenie myśli i szybsze zasypianie." },
] as const;

const CARE = [
  { icon: "cleaning_services", text: "Po każdej sesji przetrzyj elektrody wilgotną szmatką, żeby usunąć resztki żelu — zapobiega to podrażnieniom przy kolejnym użyciu." },
  { icon: "water_drop", text: "Nie zanurzaj urządzenia w wodzie. Do czyszczenia wystarczy wilgotna, nie mokra, szmatka." },
  { icon: "inventory_2", text: "Między sesjami przechowuj GoodStim w etui podróżnym — chroni elektrody przed zarysowaniem i kurzem." },
  { icon: "bolt", text: "Ładuj tylko suche, czyste urządzenie — wilgoć na stykach spowalnia ładowanie." },
] as const;

const PRECAUTIONS = [
  "Wszczepiony rozrusznik serca lub inne aktywne implanty elektroniczne",
  "Ciąża",
  "Przebyte operacje szyi lub choroby naczyniowe szyi",
  "Epilepsja",
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Jak używać GoodStim VNS One",
  description: "Instrukcja krok po kroku: jak nałożyć żel, założyć stymulator nerwu błędnego GoodStim i wybrać tryb sesji.",
  step: STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
  })),
};

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-surface text-on-background font-sans selection:bg-vibrant-teal selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* HERO */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <div className="max-w-2xl">
            <span className="bg-soft-mint text-secondary px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-6 inline-block">
              Instrukcja obsługi
            </span>
            <h1 className="font-montserrat text-[clamp(36px,5vw,48px)] leading-[1.16] font-bold tracking-[-0.02em] text-tech-blue mb-6">
              Jak używać GoodStim
            </h1>
            <p className="text-lg leading-7 text-on-surface-variant">
              Od rozpakowania do pierwszej sesji — wszystko, co warto wiedzieć, żeby korzystać z GoodStim wygodnie, skutecznie i bezpiecznie.
            </p>
          </div>
        </section>

        {/* CO W PUDEŁKU */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <h2 className="font-montserrat text-2xl font-semibold text-primary mb-8">Co znajdziesz w pudełku</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {BOX_CONTENTS.map((item) => (
              <div key={item.label} className="p-6 bg-white rounded-[24px] border border-outline-variant/20 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-soft-mint flex items-center justify-center mb-4">
                  <Icon name={item.icon} className="text-secondary" />
                </div>
                <p className="font-montserrat font-semibold text-primary text-sm mb-1">{item.label}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ZANIM ZACZNIESZ + DIAGRAM */}
        <section className="bg-surface-container-low py-24 mb-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-tech-blue mb-6">Zanim zaczniesz</h2>
              <div className="space-y-5">
                {[
                  { icon: "battery_charging_full", text: "Naładuj urządzenie w pełni przed pierwszym użyciem — zajmuje to ok. godziny." },
                  { icon: "face", text: "Oczyść skórę szyi z kosmetyków i osusz ją — poprawia to kontakt elektrod." },
                  { icon: "sensors", text: "Elektrody umieść po bokach szyi, tam gdzie najłatwiej wyczuć puls." },
                ].map((row) => (
                  <div key={row.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-outline-variant/20">
                      <Icon name={row.icon} className="text-secondary text-[20px]" />
                    </div>
                    <p className="text-base text-on-surface-variant leading-relaxed pt-1.5">{row.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prosty diagram: sylwetka szyi + opaska + punkty elektrod */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 320 320" width="280" height="280" className="max-w-full">
                <circle cx="160" cy="160" r="150" fill="#ffffff" stroke="#dde2e7" />
                {/* Sylwetka */}
                <path d="M 110 320 C 110 250 100 220 100 190 C 100 150 125 125 160 125 C 195 125 220 150 220 190 C 220 220 210 250 210 320 Z" fill="#e8ebee" />
                <circle cx="160" cy="90" r="45" fill="#e8ebee" />
                {/* Opaska GoodStim */}
                <path d="M 90 178 A 70 70 0 1 1 230 178" fill="none" stroke="#1a2332" strokeWidth="14" strokeLinecap="round" />
                <circle cx="90" cy="178" r="12" fill="#1a2332" />
                <circle cx="230" cy="178" r="12" fill="#1a2332" />
                <circle cx="90" cy="178" r="5" fill="#2ecc71" />
                <circle cx="230" cy="178" r="5" fill="#2ecc71" />
                {/* Etykiety */}
                <line x1="90" y1="178" x2="50" y2="210" stroke="#8a94a0" strokeWidth="1.5" />
                <circle cx="50" cy="210" r="10" fill="#26a95e" />
                <text x="50" y="214" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="700">1</text>
                <line x1="230" y1="178" x2="270" y2="210" stroke="#8a94a0" strokeWidth="1.5" />
                <circle cx="270" cy="210" r="10" fill="#26a95e" />
                <text x="270" y="214" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="700">2</text>
                <text x="50" y="240" textAnchor="middle" fontSize="11" fill="#5a6673">Elektroda</text>
                <text x="270" y="240" textAnchor="middle" fontSize="11" fill="#5a6673">Elektroda</text>
              </svg>
            </div>
          </div>
        </section>

        {/* KROKI */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
              4 kroki do pierwszej sesji
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.n} className="p-8 bg-white rounded-[24px] border border-outline-variant/20 shadow-sm relative">
                <span className="absolute top-6 right-6 font-montserrat text-4xl font-bold text-soft-mint">{step.n}</span>
                <div className="w-12 h-12 rounded-full bg-soft-mint flex items-center justify-center mb-6">
                  <Icon name={step.icon} className="text-secondary" />
                </div>
                <h3 className="font-montserrat font-semibold text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRYBY — reuse istniejącej sekcji */}
        <div className="mb-0">
          <ModesSection />
        </div>

        {/* RUTYNA DNIA */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 my-24">
          <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-primary mb-4 text-center">
            Wpleć GoodStim w swój dzień
          </h2>
          <p className="text-on-surface-variant text-center max-w-xl mx-auto mb-12">
            Nie ma jednej właściwej pory — większość użytkowników sięga po GoodStim w jednym z tych trzech momentów.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ROUTINE.map((r) => (
              <div key={r.time} className="p-8 bg-tech-blue rounded-[24px] text-white">
                <Icon name={r.icon} className="text-vibrant-teal text-3xl mb-4" />
                <p className="text-xs uppercase tracking-widest text-vibrant-teal font-semibold mb-1">{r.time}</p>
                <p className="font-montserrat text-lg font-semibold mb-3">Tryb: {r.mode}</p>
                <p className="text-sm text-on-primary-container leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CZYSZCZENIE I PRZECHOWYWANIE */}
        <section className="bg-surface-container-low py-24 mb-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-tech-blue mb-10 text-center">
              Czyszczenie i przechowywanie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {CARE.map((c) => (
                <div key={c.text} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-outline-variant/20">
                  <Icon name={c.icon} className="text-secondary flex-shrink-0" />
                  <p className="text-sm text-on-surface-variant leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ŚRODKI OSTROŻNOŚCI */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <div className="max-w-3xl mx-auto p-8 md:p-10 bg-white rounded-[24px] border-2 border-error/20">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="warning" className="text-error text-2xl" fill />
              <h2 className="font-montserrat text-xl font-semibold text-primary">Ważne środki ostrożności</h2>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Nie zalecamy używania GoodStim osobom, u których występuje którekolwiek z poniższych:
            </p>
            <ul className="space-y-2 mb-6">
              {PRECAUTIONS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <Icon name="close" className="text-error text-[16px] flex-shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-xs text-on-surface-variant/70 leading-relaxed border-t border-outline-variant/20 pt-4">
              GoodStim nie jest wyrobem medycznym i nie zastępuje porady lekarskiej. W razie jakichkolwiek wątpliwości dotyczących stanu zdrowia skonsultuj się z lekarzem przed użyciem.
            </p>
          </div>
        </section>

        {/* SZYBKIE ROZWIĄZANIA */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-primary mb-10 text-center">
            Szybkie rozwiązania
          </h2>
          <TroubleshootingAccordion />
        </section>

        {/* CTA */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="bg-tech-blue rounded-[32px] p-12 md:p-16 text-center text-white">
            <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold mb-4">Gotowy na swoją pierwszą sesję?</h2>
            <p className="text-on-primary-container max-w-lg mx-auto mb-8">
              Jeśli masz dodatkowe pytania, sprawdź nasze FAQ albo napisz bezpośrednio do nas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="px-8 py-4 bg-vibrant-teal text-tech-blue rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                Zobacz GoodStim VNS One
              </Link>
              <Link href="/faq" className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
                Zobacz FAQ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
    </div>
  );
}
