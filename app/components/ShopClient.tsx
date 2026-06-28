"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Icon from "./Icon";
import { useCart } from "../lib/cart";
import { PRODUCTS, getAccessories, formatPrice } from "../lib/products";
import toast from "react-hot-toast";
import { trackViewItem, trackAddToCart } from "../lib/analytics";

const MAIN_PRODUCT = PRODUCTS.find((p) => p.id === "vns-one")!;

const IMGS = {
  main: "/product.png",
  t1: "/product2.png",
  t2: "/product3.png",
  t3: "/product.png",
};

const AGGREGATE_RATING = { score: 5.0, count: 50 };

const REVIEWS = [
  {
    name: "Katarzyna M.",
    location: "Warszawa",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    text: "Po 2 tygodniach regularnego stosowania widzę wyraźną różnicę w jakości snu. Zasypianie trwa mi teraz o połowę krócej!",
    date: "Grudzień 2024",
  },
  {
    name: "Piotr K.",
    location: "Kraków",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face",
    text: "Byłem sceptyczny, ale po miesiącu używania moje HRV wzrosło o 15 punktów. Polecam każdemu kto dużo pracuje przy komputerze.",
    date: "Styczeń 2025",
  },
  {
    name: "Agnieszka W.",
    location: "Gdańsk",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face",
    text: "Używam GoodStim przed medytacją i efekty są nieporównywalne. Znacznie szybciej wchodzę w stan głębokiego spokoju.",
    date: "Luty 2025",
  },
  {
    name: "Marek S.",
    location: "Wrocław",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face",
    text: "Cierpię na przewlekły stres zawodowy od lat. GoodStim pomaga mi szybko się wyciszyć — efekty czuję już po kilku minutach.",
    date: "Marzec 2025",
  },
  {
    name: "Joanna B.",
    location: "Poznań",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&h=80&fit=crop&crop=face",
    text: "Tryb Deep Sleep co wieczór i wybudzam się naprawdę wypoczęta. Polecam wszystkim z problemami z zasypianiem.",
    date: "Kwiecień 2025",
  },
  {
    name: "Tomasz R.",
    location: "Łódź",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face",
    text: "Sprzęt na poziomie produktów ze Stanów, w przystępnej polskiej cenie. Obsługa odpowiedziała w 2 godziny. 10/10.",
    date: "Maj 2025",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-vibrant-teal">
      {[1, 2, 3, 4].map((i) => <Icon key={i} name="star" fill />)}
      <Icon name={rating >= 5 ? "star" : "star_half"} fill />
    </div>
  );
}

export default function ShopClient() {
  const [activeThumb, setActiveThumb] = useState(0);
  const thumbs = [IMGS.main, IMGS.t1, IMGS.t2, IMGS.t3];
  const { addToCart, openCart } = useCart();
  const accessories = getAccessories();
  const buyBtnRef = useRef<HTMLButtonElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (buyBtnRef.current) observer.observe(buyBtnRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    trackViewItem({ id: MAIN_PRODUCT.id, name: MAIN_PRODUCT.name, price: MAIN_PRODUCT.price });
  }, []);

  useEffect(() => {
    if (reviewModalOpen) return;
    const timer = setInterval(() => setActiveSlide((s) => (s + 1) % REVIEWS.length), 5000);
    return () => clearInterval(timer);
  }, [reviewModalOpen]);

  const handleAdd = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    addToCart(product);
    trackAddToCart({ id: product.id, name: product.name, price: product.price });
    openCart();
    toast.success(`${product.name} dodano do koszyka!`, {
      icon: "🛒",
    });
  };

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbs[activeThumb]}
                  alt="Stymulator nerwu błędnego GoodStim VNS One — widok główny"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-vibrant-teal pulse-active" />
                  <span className="text-xs font-semibold text-tech-blue">Aktywne połączenie</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {thumbs.map((src, i) => (
                  i < 3 ? (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`aspect-square rounded-xl overflow-hidden transition-all ${activeThumb === i ? "border-2 border-secondary" : "border border-outline-variant/30 hover:border-secondary"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`GoodStim stymulator nerwu błędnego — widok ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setActiveThumb(i)}
                      className={`aspect-square rounded-xl overflow-hidden flex items-center justify-center bg-surface-container transition-all ${activeThumb === i ? "border-2 border-secondary" : "border border-outline-variant/30 hover:border-secondary"}`}
                      aria-label="Odtwórz wideo produktowe"
                    >
                      <Icon name="play_circle" className="text-on-surface-variant" />
                    </button>
                  )
                ))}
              </div>
            </div>

            {/* Purchase card */}
            <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-soft-mint text-secondary text-xs font-semibold tracking-wide rounded-full">EDYCJA PREMIUM</span>
                <h1 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">GoodStim VNS One</h1>
                <p className="text-lg leading-7 text-on-surface-variant">Najbardziej zaawansowany stymulator nerwu błędnego do codziennej optymalizacji balansu autonomicznego.</p>
                <div className="flex items-center gap-2">
                  <Stars rating={5} />
                  <span className="text-sm text-on-surface-variant">5.0 (50 opinii)</span>
                </div>
              </div>

              <div className="p-6 bg-surface-container-lowest border border-outline-variant/20 rounded-[24px] shadow-sm space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-montserrat text-[48px] leading-[56px] font-bold text-tech-blue">550 PLN</span>
                  <span className="text-base text-on-surface-variant line-through">699 PLN</span>
                </div>
                <div className="space-y-4">
                  <button
                    ref={buyBtnRef}
                    onClick={() => handleAdd(MAIN_PRODUCT.id)}
                    className="w-full py-5 rounded-full font-semibold text-sm tracking-wide transition-all text-center btn-press flex items-center justify-center gap-2 bg-tech-blue hover:bg-primary text-white"
                  >
                    <Icon name="add_shopping_cart" className="text-[20px]" />
                    Dodaj do koszyka
                  </button>
                  <p className="text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                    <Icon name="local_shipping" className="text-[16px]" />
                    Darmowa dostawa i 30-dniowa gwarancja zwrotu
                  </p>
                </div>
                <div className="pt-6 border-t border-outline-variant/20 grid grid-cols-2 gap-4">
                  {[
                    { icon: "battery_charging_full", label: "Bateria 500 mAh" },
                    { icon: "settings_remote", label: "Pilot w zestawie" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center">
                        <Icon name={f.icon} className="text-secondary" />
                      </div>
                      <span className="text-xs font-semibold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-montserrat text-xl font-semibold text-primary">Kluczowe Parametry</h3>
                {[
                  { label: "Kompatybilność", value: "iOS, Android, Apple Health" },
                  { label: "Materiał", value: "Hipoalergiczny silikon, przyjazny dla skóry" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-3 border-b border-outline-variant/10">
                    <span className="text-base text-on-surface-variant">{row.label}</span>
                    <span className="text-sm font-semibold text-right max-w-[180px]">{row.value}</span>
                  </div>
                ))}
                {/* VNS intensity visualizer */}
                <div className="py-3 border-b border-outline-variant/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-on-surface-variant">Intensywność stymulacji</span>
                    <span className="text-sm font-semibold">1 – 50 mA</span>
                  </div>
                  <div className="vns-progress-track">
                    <div className="vns-progress-fill" style={{ width: "72%" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-outline uppercase tracking-widest">
                    <span>Relax</span><span>Focus</span><span>Deep</span><span>Max</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOX CONTENTS */}
          <section className="mt-40 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">Co znajdziesz w pudełku</h2>
              <p className="text-lg leading-7 text-on-surface-variant max-w-2xl mx-auto">Wszystko, czego potrzebujesz, aby rozpocząć swoją podróż ku lepszemu samopoczuciu od pierwszego dnia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 p-8 bg-tech-blue rounded-[32px] text-white overflow-hidden relative group">
                <div className="relative z-10 space-y-4">
                  <span className="text-xs font-semibold text-vibrant-teal uppercase tracking-widest">Główny Moduł</span>
                  <h3 className="font-montserrat text-2xl font-semibold">GoodStim VNS One</h3>
                  <p className="text-on-primary-container leading-relaxed text-sm">Precyzyjnie skalibrowane impulsy elektryczne dostosowane do stymulacji nerwu błędnego — 4 tryby, regulowana intensywność 0–10 mA.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Icon name="settings_input_antenna" className="text-[200px]" fill />
                </div>
              </div>
              <div className="p-8 bg-surface-container-low border border-outline-variant/20 rounded-[32px] flex flex-col justify-between">
                <div className="space-y-4">
                  <Icon name="charging_station" className="text-secondary text-4xl" />
                  <h3 className="font-montserrat text-xl font-semibold">Stacja ładująca</h3>
                </div>
                <p className="text-on-surface-variant text-sm">Magnetyczne ładowanie USB-C dla wygody.</p>
              </div>
              <div className="p-8 bg-soft-mint rounded-[32px] flex flex-col justify-between">
                <div className="space-y-4">
                  <Icon name="verified_user" className="text-secondary text-4xl" />
                  <h3 className="font-montserrat text-xl font-semibold">Zestaw elektrod</h3>
                </div>
                <p className="text-on-surface-variant text-sm">Zapas na 3 miesiące użytkowania.</p>
              </div>
            </div>
          </section>

          {/* HRV CHART */}
          <section className="mt-40 bg-white rounded-[40px] p-12 border border-outline-variant/20 shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">Co mówią użytkownicy?</h2>
                  <p className="text-lg leading-7 text-on-surface-variant">Użytkownicy zgłaszają większe poczucie spokoju, łatwiejsze zasypianie i lepszą jakość snu po regularnym stosowaniu GoodStim.</p>
                </div>
                <div className="space-y-6">
                  {[
                    { icon: "self_improvement", title: "Spokój i wyciszenie", sub: "Użytkownicy zgłaszają szybsze przejście w stan relaksu po sesjach" },
                    { icon: "bedtime", title: "Jakość snu", sub: "Użytkownicy zgłaszają łatwiejsze zasypianie i bardziej wypoczęte poranki" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-vibrant-teal/10 flex items-center justify-center text-vibrant-teal flex-shrink-0">
                        <Icon name={item.icon} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-tech-blue">{item.title}</p>
                        <p className="text-xs text-on-surface-variant">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant/60 leading-relaxed">
                  Opisy oparte na doświadczeniach użytkowników. GoodStim nie jest wyrobem medycznym i nie zastępuje porady lekarskiej.
                </p>
              </div>
              {/* Chart */}
              <div className="relative bg-surface-container rounded-3xl p-8 aspect-[4/3] flex flex-col justify-end">
                <div className="absolute inset-8">
                  <div className="w-full h-full border-l-2 border-b-2 border-outline-variant/40 flex items-end justify-between relative">
                    {[
                      { h: "30%", label: "Kontrola", color: "bg-outline-variant/30" },
                      { h: "65%", label: "Tydz. 2", color: "bg-vibrant-teal/40" },
                      { h: "85%", label: "Tydz. 4", color: "bg-vibrant-teal/70" },
                      { h: "95%", label: "Cel", color: "bg-vibrant-teal" },
                    ].map((bar) => (
                      <div key={bar.label} className={`w-1/4 ${bar.color} rounded-t-lg relative group`} style={{ height: bar.h }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-tech-blue text-white text-[10px] px-2 py-1 rounded whitespace-nowrap transition-opacity">
                          {bar.label}
                        </div>
                      </div>
                    ))}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <path d="M0 250 Q 80 180, 160 120 T 320 40" fill="none" stroke="#00D57A" strokeDasharray="1000" strokeDashoffset="1000" strokeWidth="3">
                        <animate attributeName="stroke-dashoffset" dur="2s" fill="freeze" from="1000" to="0" />
                      </path>
                    </svg>
                  </div>
                </div>
                <div className="relative flex justify-between mt-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  <span>Start</span><span>Tydzień 2</span><span>Tydzień 4</span><span>Cel</span>
                </div>
              </div>
            </div>
          </section>

          {/* ACCESSORIES */}
          <section className="mt-40 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-soft-mint text-secondary text-xs font-semibold tracking-widest rounded-full uppercase">Akcesoria</span>
                <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-primary">
                  Uzupełnij zestaw
                </h2>
              </div>
              <p className="text-on-surface-variant text-sm max-w-sm">Żel i elektrody zapasowe kompatybilne wyłącznie z GoodStim VNS One.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessories.map((acc) => (
                <div key={acc.id} className="bg-white rounded-[24px] border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-surface-container-low overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
                    {acc.badge && (
                      <span className="absolute top-4 left-4 px-2.5 py-1 bg-vibrant-teal text-tech-blue text-[10px] font-bold uppercase tracking-wider rounded-full">
                        {acc.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-montserrat text-base font-semibold text-primary">{acc.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{acc.subtitle}</p>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed flex-1">{acc.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-montserrat text-xl font-bold text-tech-blue">{formatPrice(acc.price)}</span>
                      <button
                        onClick={() => handleAdd(acc.id)}
                        className="px-5 py-2.5 bg-tech-blue text-white text-xs font-semibold rounded-full hover:bg-primary transition-colors flex items-center gap-1.5"
                      >
                        <Icon name="add" className="text-[16px]" />
                        Dodaj
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS */}
          <section id="reviews" className="mt-40 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">Głosy naszej społeczności</h2>
                <div className="flex items-center gap-6">
                  <span className="font-montserrat text-[48px] leading-[56px] font-bold text-tech-blue">{AGGREGATE_RATING.score.toFixed(1)}</span>
                  <div className="space-y-1">
                    <Stars rating={AGGREGATE_RATING.score} />
                    <p className="text-xs text-on-surface-variant">{AGGREGATE_RATING.count} opinii z poprzedniej wersji urządzenia</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-8 py-4 border-2 border-tech-blue rounded-full text-sm font-semibold text-tech-blue hover:bg-tech-blue hover:text-white transition-colors self-start md:self-auto"
              >
                Podziel się opinią
              </button>
            </div>

            {/* Slider */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {REVIEWS.map((review) => (
                  <div key={review.name} className="w-full flex-shrink-0 px-1">
                    <div className="bg-white rounded-[32px] border border-outline-variant/20 shadow-sm p-8 md:p-10 space-y-6">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-primary">{review.name}</p>
                          <p className="text-xs text-on-surface-variant">{review.location} · {review.date}</p>
                        </div>
                        <div className="ml-auto">
                          <Stars rating={5} />
                        </div>
                      </div>
                      <p className="text-lg leading-8 text-on-surface-variant">„{review.text}"</p>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant/50">
                        <Icon name="verified" className="text-vibrant-teal text-[16px]" />
                        Zweryfikowany zakup
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Arrows */}
              <button
                onClick={() => setActiveSlide((s) => (s - 1 + REVIEWS.length) % REVIEWS.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-outline-variant/20 flex items-center justify-center text-tech-blue hover:bg-soft-mint transition-colors z-10"
                aria-label="Poprzednia opinia"
              >
                <Icon name="chevron_left" />
              </button>
              <button
                onClick={() => setActiveSlide((s) => (s + 1) % REVIEWS.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-outline-variant/20 flex items-center justify-center text-tech-blue hover:bg-soft-mint transition-colors z-10"
                aria-label="Następna opinia"
              >
                <Icon name="chevron_right" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? "w-8 bg-tech-blue" : "w-2 bg-outline-variant/40 hover:bg-outline-variant"}`}
                  aria-label={`Przejdź do opinii ${i + 1}`}
                />
              ))}
            </div>

            <p className="text-xs text-center text-on-surface-variant/60">
              Zbieramy opinie od nowych użytkowników GoodStim VNS One. Napisz do nas po zakupie!
            </p>
          </section>
        </div>
      </main>

      <Footer />

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReviewModalOpen(false)}>
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat text-xl font-bold text-primary">Podziel się opinią</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <Icon name="close" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-on-surface-variant mb-1.5 block">Twoje imię</label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="np. Anna K."
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-tech-blue transition-colors"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface-variant mb-1.5 block">Ocena</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-colors ${star <= reviewRating ? "text-vibrant-teal" : "text-outline-variant/30"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-on-surface-variant mb-1.5 block">Twoja opinia</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Co Ci się podobało? Jak produkt wpłynął na Twoje samopoczucie?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-tech-blue transition-colors resize-none"
                />
              </div>
            </div>

            <a
              href={`mailto:kontakt@goodstim.pl?subject=Opinia%20GoodStim%20VNS%20One&body=Imię%3A%20${encodeURIComponent(reviewName)}%0AOcena%3A%20${"★".repeat(reviewRating)}%0A%0A${encodeURIComponent(reviewText)}`}
              onClick={() => setReviewModalOpen(false)}
              className={`block w-full py-4 rounded-full font-semibold text-sm text-center transition-all ${reviewName && reviewText ? "bg-tech-blue text-white hover:bg-primary" : "bg-outline-variant/20 text-on-surface-variant/50 pointer-events-none"}`}
            >
              Wyślij opinię
            </a>
            <p className="text-xs text-center text-on-surface-variant/50">Opinia zostanie wysłana do nas e-mailem i opublikowana po weryfikacji.</p>
          </div>
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${stickyVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="bg-surface/95 backdrop-blur-md border-t border-outline-variant/20 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-on-surface-variant">GoodStim VNS One</p>
            <p className="font-montserrat font-bold text-tech-blue text-lg leading-tight">550 PLN</p>
          </div>
          <button
            onClick={() => handleAdd(MAIN_PRODUCT.id)}
            className="bg-tech-blue text-white px-6 py-3.5 rounded-2xl font-semibold text-sm btn-press flex items-center gap-2 shrink-0"
          >
            <Icon name="add_shopping_cart" className="text-[18px]" />
            Do koszyka
          </button>
        </div>
      </div>
    </div>
  );
}
