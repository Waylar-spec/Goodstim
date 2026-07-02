"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icon from "../components/Icon";
import { useCart } from "../lib/cart";
import { formatPrice, getProduct } from "../lib/products";
import StripeProvider from "../components/StripeProvider";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import InPostWidget from "../components/InPostWidget";
import { trackBeginCheckout, trackPurchase } from "../lib/analytics";

type Delivery = "courier" | "inpost";

interface Locker {
  name: string;
  address: { line1: string; city: string };
}

function genOrderNumber() {
  return "GS-" + Math.floor(100000 + Math.random() * 900000);
}

function getAffiliateCode(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)gs_ref=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function CheckoutPageInner() {
  const [delivery, setDelivery] = useState<Delivery>("courier");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsletterAccepted, setNewsletterAccepted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<"idle" | "ok">("idle");
  const [step, setStep] = useState(1);
  const [wantInvoice, setWantInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [nip, setNip] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [couponLabel, setCouponLabel] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [couponAffiliateCode, setCouponAffiliateCode] = useState("");
  const { items, total, removeFromCart, setQty, clearCart, addToCart } = useCart();
  const searchParams = useSearchParams();

  const discountAmount = Math.round(total * discountPct / 100 * 100) / 100;
  const totalAfterDiscount = Math.max(0, total - discountAmount);
  const amountGrosze = Math.round(totalAfterDiscount * 100);
  const orderNumber = useState(() => genOrderNumber())[0];

  useEffect(() => {
    if (items.length > 0) trackBeginCheckout(items, totalAfterDiscount);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Odtworzenie koszyka z maila o porzuconym koszyku (?recover=token) — tylko gdy koszyk jest pusty,
  // żeby nie nadpisać tego co ktoś ma już w koszyku na tym urządzeniu.
  useEffect(() => {
    const token = searchParams.get("recover");
    if (!token || items.length > 0) return;

    fetch(`/api/cart/recover?token=${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        (data.items as { id: string; qty: number }[]).forEach(i => {
          const product = getProduct(i.id);
          if (!product) return;
          for (let n = 0; n < i.qty; n++) addToCart(product);
        });
        if (data.name) {
          const [first, ...rest] = String(data.name).split(" ");
          setFirstName(first ?? "");
          setLastName(rest.join(" "));
        }
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponState("loading");
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.valid) {
        setDiscountPct(data.discountPct);
        setCouponLabel(data.label);
        setCouponAffiliateCode(data.affiliateCode ?? "");
        setCouponState("ok");
      } else {
        setDiscountPct(0);
        setCouponLabel("");
        setCouponAffiliateCode("");
        setCouponState("error");
      }
    } catch {
      setDiscountPct(0);
      setCouponLabel("");
      setCouponAffiliateCode("");
      setCouponState("error");
    }
  }

  function validateBeforePayment(): string | null {
    if (!firstName.trim() || !lastName.trim()) return "Podaj imię i nazwisko.";
    if (!email.trim()) return "Podaj adres e-mail.";
    if (delivery === "courier" && (!address.trim() || !city.trim() || !postalCode.trim()))
      return "Uzupełnij pełny adres dostawy.";
    if (delivery === "inpost" && !selectedLocker)
      return "Wybierz paczkomat z mapy.";
    if (delivery === "inpost" && !phone.trim())
      return "Podaj numer telefonu — InPost wyśle na niego kod do odbioru.";
    if (wantInvoice && !companyName.trim()) return "Podaj nazwę firmy do faktury.";
    if (wantInvoice && !nip.trim()) return "Podaj NIP do faktury.";
    if (!termsAccepted) return "Akceptacja Regulaminu jest wymagana.";
    if (!privacyAccepted) return "Akceptacja Polityki prywatności jest wymagana.";
    return null;
  }

  function handlePaymentAttempt() {
    const err = validateBeforePayment();
    if (err) { setFormError(err); return false; }
    setFormError(null);
    return true;
  }

  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!firstName.trim() || !lastName.trim()) return "Podaj imię i nazwisko.";
      if (!email.trim()) return "Podaj adres e-mail.";
    }
    if (s === 2) {
      if (delivery === "courier" && (!address.trim() || !city.trim() || !postalCode.trim()))
        return "Uzupełnij pełny adres dostawy.";
      if (delivery === "inpost" && !selectedLocker) return "Wybierz paczkomat z mapy.";
      if (delivery === "inpost" && !phone.trim())
        return "Podaj numer telefonu — InPost wyśle na niego kod do odbioru.";
      if (wantInvoice && !companyName.trim()) return "Podaj nazwę firmy do faktury.";
      if (wantInvoice && !nip.trim()) return "Podaj NIP do faktury.";
    }
    return null;
  }

  function goNext() {
    const err = validateStep(step);
    if (err) { setFormError(err); return; }
    setFormError(null);
    if (step === 1) saveAbandonedCart();
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Zapis koszyka po przejściu dalej od danych kontaktowych — jeśli ktoś nie dokończy checkoutu,
  // cron wyśle mu przypomnienie mailem. Fire-and-forget, nie blokuje UI.
  function saveAbandonedCart() {
    fetch("/api/cart/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: `${firstName} ${lastName}`.trim(),
        phone,
        items: items.map(({ product, qty }) => ({ id: product.id, qty })),
        total: totalAfterDiscount,
      }),
    }).catch(() => {});
  }

  function goBack() {
    setFormError(null);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const STEP_LABELS = [
    { n: 1, label: "Dane kontaktowe" },
    { n: 2, label: "Dostawa" },
    { n: 3, label: "Płatność" },
  ];

  async function sendConfirmation() {
    trackPurchase(
      orderNumber,
      totalAfterDiscount,
      items.map(({ product, qty }) => ({ name: product.name, qty, price: product.price }))
    );
    if (newsletterAccepted && email) {
      await fetch("/api/email/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    }
    clearCart();
    setOrderState("ok");
  }

  const deliveryAddress = delivery === "inpost" && selectedLocker
    ? `${selectedLocker.name} — ${selectedLocker.address.line1}, ${selectedLocker.address.city}`
    : `${address}, ${city} ${postalCode}`.trim();

  const metadata = {
    customer_name: `${firstName} ${lastName}`.trim(),
    customer_email: email,
    customer_phone: phone,
    delivery_method: delivery,
    address_line1: delivery === "inpost" ? (selectedLocker?.name ?? "") : address,
    city: delivery === "inpost" ? (selectedLocker?.address.city ?? "") : city,
    postal_code: delivery === "inpost" ? "" : postalCode,
    inpost_locker: selectedLocker?.name ?? "",
    want_invoice: wantInvoice ? "1" : "0",
    company_name: companyName,
    nip: nip,
    order_number: orderNumber,
    coupon_code: discountPct > 0 ? couponCode.toUpperCase() : "",
    discount_pct: discountPct > 0 ? String(discountPct) : "",
    affiliate_code: couponAffiliateCode || getAffiliateCode(),
    items_json: JSON.stringify(items.map(({ product, qty }) => ({
      name: product.name, subtitle: product.subtitle, qty, price: product.price,
    }))),
  };

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans flex flex-col">

      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/20 shadow-[0px_4px_20px_rgba(37,37,55,0.04)]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 md:px-16 h-20">
          <Link href="/" className="font-montserrat text-2xl font-bold tracking-tight text-primary">GoodStim</Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
              <Icon name="lock" className="text-[20px]" />
              <span>Bezpieczna płatność</span>
            </div>
            <Link href="/shop" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold">
              <Icon name="arrow_back" />
              <span>Wróć do sklepu</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 lg:flex lg:gap-16">
          {orderState === "ok" && (
            <div className="w-full py-20 flex flex-col items-center text-center gap-6">
              <div className="w-20 h-20 bg-soft-mint rounded-full flex items-center justify-center">
                <Icon name="check_circle" className="text-secondary text-5xl" fill />
              </div>
              <h2 className="font-montserrat text-3xl font-bold text-primary">Zamówienie złożone!</h2>
              <p className="text-on-surface-variant max-w-md">
                Potwierdzenie zostało wysłane na <strong>{email}</strong>. Paczka wyruszy w ciągu 1–2 dni roboczych.
              </p>
              {delivery === "inpost" && selectedLocker && (
                <p className="text-sm text-on-surface-variant">
                  Paczkomat: <strong>{selectedLocker.name}</strong> — {selectedLocker.address.line1}, {selectedLocker.address.city}
                </p>
              )}
              <Link href="/" className="px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-all">
                Wróć na stronę główną
              </Link>
            </div>
          )}

          {orderState !== "ok" && <>
            <div className="flex-grow lg:max-w-[700px]">
              <h1 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary mb-8">
                Sfinalizuj zamówienie
              </h1>

              {/* Stepper */}
              <div className="flex items-center gap-2 mb-10">
                {STEP_LABELS.map((s, i) => (
                  <div key={s.n} className={`flex items-center gap-2 ${i < 2 ? "flex-1" : ""}`}>
                    <button
                      type="button"
                      onClick={() => { if (s.n < step) { setFormError(null); setStep(s.n); } }}
                      disabled={s.n > step}
                      className={`flex items-center gap-2 ${s.n < step ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        step > s.n ? "bg-vibrant-teal text-tech-blue" : step === s.n ? "bg-tech-blue text-white" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {step > s.n ? "✓" : s.n}
                      </span>
                      <span className={`text-sm font-semibold hidden sm:inline ${step === s.n ? "text-primary" : "text-on-surface-variant"}`}>{s.label}</span>
                    </button>
                    {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > s.n ? "bg-vibrant-teal" : "bg-outline-variant/30"}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (<>
              {/* 1. Dane osobowe */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="font-montserrat text-2xl font-semibold">Dane kontaktowe</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Imię *</label>
                    <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                      className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                      placeholder="np. Jan" type="text" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Nazwisko *</label>
                    <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
                      className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                      placeholder="np. Kowalski" type="text" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">E-mail (potwierdzenie zamówienia) *</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                      placeholder="jan@example.com" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant px-1">
                      Telefon{delivery === "inpost" ? " * (wymagany do odbioru InPost)" : " (opcjonalny)"}
                    </label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                      placeholder="+48 500 000 000" />
                  </div>
                </div>
              </section>

              {formError && (
                <div className="flex items-start gap-2 p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <Icon name="error_outline" className="text-[18px] flex-shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}
              <div className="flex justify-end mb-8">
                <button type="button" onClick={goNext}
                  className="px-8 py-4 bg-tech-blue text-white rounded-xl font-semibold text-sm hover:bg-primary transition-all flex items-center gap-2 btn-press">
                  Dalej: Dostawa
                  <Icon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
              </>)}

              {step === 2 && (<>
              {/* 2. Metoda dostawy */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="font-montserrat text-2xl font-semibold">Metoda dostawy</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { id: "courier" as Delivery, icon: "local_shipping", label: "InPost Kurier", sub: "1–2 dni robocze · Bezpłatna" },
                    { id: "inpost" as Delivery, icon: "inventory_2", label: "InPost Paczkomat", sub: "1–2 dni robocze · Bezpłatna" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => { setDelivery(opt.id); setSelectedLocker(null); }}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${delivery === opt.id ? "border-vibrant-teal bg-white shadow-sm" : "border-outline-variant/30 bg-white hover:bg-surface-container-low"}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${delivery === opt.id ? "bg-soft-mint" : "bg-surface-container"}`}>
                        <Icon name={opt.icon} className={delivery === opt.id ? "text-secondary" : "text-on-surface-variant"} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary">{opt.label}</p>
                        <p className="text-xs text-on-surface-variant">{opt.sub}</p>
                      </div>
                      {delivery === opt.id && <Icon name="check_circle" className="text-secondary ml-auto" fill />}
                    </button>
                  ))}
                </div>

                {/* Adres kurierski */}
                {delivery === "courier" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">Adres dostawy *</label>
                      <input required value={address} onChange={(e) => setAddress(e.target.value)}
                        className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                        placeholder="Ulica i numer" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">Miasto *</label>
                      <input required value={city} onChange={(e) => setCity(e.target.value)}
                        className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                        placeholder="np. Warszawa" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">Kod pocztowy *</label>
                      <input required value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                        placeholder="np. 00-001" type="text" />
                    </div>
                  </div>
                )}

                {/* Paczkomat InPost */}
                {delivery === "inpost" && (
                  <InPostWidget
                    onSelect={(locker) => setSelectedLocker(locker)}
                    selected={selectedLocker}
                  />
                )}
              </section>

              {/* 2b. Dane do faktury */}
              <section className="mb-12">
                <label className="flex items-center gap-3 cursor-pointer group mb-4">
                  <input type="checkbox" checked={wantInvoice} onChange={(e) => setWantInvoice(e.target.checked)}
                    className="w-4 h-4 rounded accent-vibrant-teal flex-shrink-0 cursor-pointer" />
                  <span className="text-sm font-semibold text-on-surface-variant">Chcę fakturę VAT na firmę</span>
                </label>
                {wantInvoice && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">Nazwa firmy *</label>
                      <input value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                        className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                        placeholder="np. Firma Sp. z o.o." type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">NIP *</label>
                      <input value={nip} onChange={(e) => setNip(e.target.value)}
                        className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                        placeholder="np. 1234567890" type="text" />
                    </div>
                    <div className="flex items-end pb-1">
                      <p className="text-xs text-on-surface-variant/70">Fakturę wyślemy e-mailem do 3 dni roboczych od realizacji zamówienia.</p>
                    </div>
                  </div>
                )}
              </section>

              {formError && (
                <div className="flex items-start gap-2 p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <Icon name="error_outline" className="text-[18px] flex-shrink-0 mt-0.5" />
                  {formError}
                </div>
              )}
              <div className="flex justify-between mb-8">
                <button type="button" onClick={goBack}
                  className="px-6 py-4 text-on-surface-variant hover:text-primary font-semibold text-sm flex items-center gap-2 transition-colors">
                  <Icon name="arrow_back" className="text-[18px]" />
                  Wstecz
                </button>
                <button type="button" onClick={goNext}
                  className="px-8 py-4 bg-tech-blue text-white rounded-xl font-semibold text-sm hover:bg-primary transition-all flex items-center gap-2 btn-press">
                  Dalej: Płatność
                  <Icon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
              </>)}

              {step === 3 && (<>
              <button type="button" onClick={goBack}
                className="mb-6 text-sm text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1.5 transition-colors">
                <Icon name="arrow_back" className="text-[18px]" />
                Wstecz do dostawy
              </button>
              {/* 3. Płatność */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="font-montserrat text-2xl font-semibold">Metoda płatności</h2>
                </div>
                <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
                  {items.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-4">Koszyk jest pusty.</p>
                  ) : amountGrosze === 0 ? (
                    <button
                      onClick={() => { if (handlePaymentAttempt()) sendConfirmation(); }}
                      className="w-full bg-vibrant-teal text-tech-blue py-5 rounded-2xl font-semibold text-sm tracking-wide transition-all shadow-lg hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <Icon name="check_circle" className="text-[20px]" />
                      Złóż zamówienie bezpłatnie
                    </button>
                  ) : (
                    <StripeProvider amount={amountGrosze}>
                      <StripeCheckoutForm
                        totalGrosze={amountGrosze}
                        email={email}
                        firstName={firstName}
                        metadata={metadata}
                        onBeforeSubmit={handlePaymentAttempt}
                        onSuccess={sendConfirmation}
                      />
                    </StripeProvider>
                  )}
                </div>
              </section>

              {/* Zgody — wymagane prawnie */}
              <section className="mb-8 space-y-4">
                {formError && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <Icon name="error_outline" className="text-[18px] flex-shrink-0 mt-0.5" />
                    {formError}
                  </div>
                )}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-vibrant-teal flex-shrink-0 cursor-pointer" />
                  <span className="text-sm text-on-surface-variant leading-relaxed">
                    Zapoznałem/am się z{" "}
                    <Link href="/regulamin" target="_blank" className="text-primary underline hover:text-vibrant-teal">Regulaminem sklepu</Link>
                    {" "}i akceptuję jego treść. Przyjmuję do wiadomości prawo do odstąpienia od umowy w ciągu 14 dni. <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-vibrant-teal flex-shrink-0 cursor-pointer" />
                  <span className="text-sm text-on-surface-variant leading-relaxed">
                    Zapoznałem/am się z{" "}
                    <Link href="/polityka-prywatnosci" target="_blank" className="text-primary underline hover:text-vibrant-teal">Polityką prywatności</Link>
                    {" "}i wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji zamówienia (podstawa: art. 6 ust. 1 lit. b RODO). <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={newsletterAccepted} onChange={(e) => setNewsletterAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-vibrant-teal flex-shrink-0 cursor-pointer" />
                  <span className="text-sm text-on-surface-variant leading-relaxed">
                    Chcę dołączyć do newslettera GoodStim i otrzymywać informacje o nowościach oraz ofertach specjalnych. Zgodę mogę wycofać w dowolnym momencie.
                  </span>
                </label>
                <p className="text-xs text-on-surface-variant/60 px-1">* Pola obowiązkowe</p>
              </section>

              {/* Odznaki */}
              <div className="flex flex-wrap items-center gap-8 py-8 border-t border-outline-variant/20">
                {[
                  { icon: "verified_user", label: "Szyfrowanie SSL" },
                  { icon: "favorite", label: "30-dniowa gwarancja" },
                  { icon: "package_2", label: "Ekologiczna dostawa" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 opacity-60">
                    <Icon name={b.icon} className="text-vibrant-teal" fill />
                    <span className="text-xs uppercase tracking-wider font-semibold">{b.label}</span>
                  </div>
                ))}
              </div>
              </>)}
            </div>

            {/* Prawa strona: podsumowanie */}
            <aside className="lg:w-[400px] mt-12 lg:mt-0">
              <div className="sticky top-32">
                <div className="bg-white rounded-[24px] border border-outline-variant/10 shadow-[0px_4px_20px_rgba(37,37,55,0.04)] overflow-hidden">
                  <div className="p-8 bg-tech-blue">
                    <h3 className="font-montserrat text-2xl font-semibold text-white">Twoje zamówienie</h3>
                    <p className="text-on-primary-container text-xs mt-1">Zamówienie #{orderNumber}</p>
                  </div>
                  <div className="p-8 space-y-6">
                    {items.length === 0 ? (
                      <div className="text-center py-8 space-y-3">
                        <p className="text-on-surface-variant text-sm">Koszyk jest pusty.</p>
                        <Link href="/shop" className="text-secondary font-semibold text-sm hover:underline">Wróć do sklepu</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map(({ product, qty }) => (
                          <div key={product.id} className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                              <div>
                                <h4 className="text-sm font-semibold text-primary truncate">{product.name}</h4>
                                <p className="text-xs text-on-surface-variant">{product.subtitle}</p>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-secondary">{formatPrice(product.price * qty)}</span>
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => setQty(product.id, qty - 1)} className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container text-on-surface-variant">
                                    <Icon name="remove" className="text-[14px]" />
                                  </button>
                                  <span className="text-xs font-bold w-4 text-center">{qty}</span>
                                  <button onClick={() => setQty(product.id, qty + 1)} className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container text-on-surface-variant">
                                    <Icon name="add" className="text-[14px]" />
                                  </button>
                                  <button onClick={() => removeFromCart(product.id)} className="ml-1 text-on-surface-variant/40 hover:text-error transition-colors">
                                    <Icon name="delete_outline" className="text-[16px]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <hr className="border-outline-variant/20" />
                    <div className="space-y-3">
                      <div className="flex justify-between text-base text-on-surface-variant"><span>Suma</span><span>{formatPrice(total)}</span></div>
                      {discountPct > 0 && (
                        <div className="flex justify-between text-sm text-vibrant-teal font-semibold">
                          <span>Rabat ({couponCode.toUpperCase()}, -{discountPct}%)</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base text-on-surface-variant"><span>Dostawa</span><span className="text-vibrant-teal font-semibold">Bezpłatna</span></div>
                      <div className="flex justify-between font-montserrat text-xl font-bold text-primary pt-2"><span>Razem</span><span>{formatPrice(totalAfterDiscount)}</span></div>

                      {/* Kod rabatowy */}
                      <div className="pt-2">
                        {couponState === "ok" ? (
                          <div className="flex items-center justify-between px-3 py-2 bg-soft-mint border border-vibrant-teal/30 rounded-xl text-sm">
                            <span className="text-secondary font-semibold flex items-center gap-1.5">
                              <Icon name="check_circle" className="text-[16px]" fill />
                              {couponLabel}
                            </span>
                            <button onClick={() => { setCouponState("idle"); setDiscountPct(0); setCouponCode(""); setCouponLabel(""); }}
                              className="text-on-surface-variant hover:text-error text-xs">Usuń</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponState("idle"); }}
                              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                              placeholder="Kod rabatowy"
                              className="flex-1 bg-soft-mint rounded-xl px-3 py-2.5 text-sm border-none input-focus-effect text-on-surface placeholder:text-on-surface-variant/50"
                            />
                            <button onClick={applyCoupon} disabled={couponState === "loading" || !couponCode.trim()}
                              className="px-4 py-2.5 bg-tech-blue text-white text-sm font-semibold rounded-xl hover:bg-primary transition-all disabled:opacity-50">
                              {couponState === "loading" ? "…" : "Użyj"}
                            </button>
                          </div>
                        )}
                        {couponState === "error" && (
                          <p className="text-xs text-red-500 mt-1.5 px-1">Nieprawidłowy kod rabatowy</p>
                        )}
                      </div>
                    </div>
                    {deliveryAddress && (
                      <div className="flex items-start gap-2 text-xs text-on-surface-variant bg-surface-container-lowest rounded-xl p-3">
                        <Icon name={delivery === "inpost" ? "inventory_2" : "local_shipping"} className="text-[16px] flex-shrink-0 mt-0.5 text-secondary" />
                        <span>{deliveryAddress || "Adres dostawy zostanie uzupełniony"}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 p-6 bg-soft-mint rounded-2xl border border-vibrant-teal/20 flex items-start gap-4">
                  <Icon name="published_with_changes" className="text-vibrant-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-primary">30-dniowa Gwarancja Snu</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Jeśli nie poczujesz mierzalnej poprawy jakości snu i spokoju, zwróć urządzenie — pełny zwrot pieniędzy bez pytań.</p>
                  </div>
                </div>
              </div>
            </aside>
          </>}
        </div>
      </main>

      <footer className="bg-tech-blue py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</div>
          <div className="flex gap-8">
            {[
              { label: "Regulamin", href: "/regulamin" },
              { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
              { label: "Kontakt", href: "mailto:kontakt@goodstim.pl" },
            ].map((l) => (
              <Link key={l.label} className="text-on-primary-container hover:text-white transition-colors text-xs font-semibold" href={l.href}>{l.label}</Link>
            ))}
          </div>
          <p className="text-on-primary-container text-xs">© 2026 GoodStim</p>
        </div>
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CheckoutPageInner />
    </Suspense>
  );
}
