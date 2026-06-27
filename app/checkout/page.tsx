"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "../components/Icon";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/products";
import StripeProvider from "../components/StripeProvider";
import StripeCheckoutForm from "../components/StripeCheckoutForm";
import InPostWidget from "../components/InPostWidget";

type Delivery = "courier" | "inpost";

function genOrderNumber() {
  return "GS-" + Math.floor(100000 + Math.random() * 900000);
}

export default function CheckoutPage() {
  const [delivery, setDelivery] = useState<Delivery>("courier");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "ok">("idle");
  const { items, total, removeFromCart, setQty } = useCart();

  const amountGrosze = Math.round(total * 100);

  async function sendConfirmation() {
    const orderNumber = genOrderNumber();
    await fetch("/api/email/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        firstName,
        orderNumber,
        items: items.map(({ product, qty }) => ({
          name: product.name,
          subtitle: product.subtitle,
          qty,
          price: product.price,
        })),
        total,
      }),
    });
    setOrderState("ok");
  }

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans flex flex-col">

      {/* Nagłówek checkout */}
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
            <Link href="/" className="px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-all">
              Wróć na stronę główną
            </Link>
          </div>
        )}
        {orderState !== "ok" && <>

          {/* Lewa strona: formularze */}
          <div className="flex-grow lg:max-w-[700px]">
            <h1 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary mb-8">
              Sfinalizuj zamówienie
            </h1>

            {/* Dane dostawy */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-montserrat text-2xl font-semibold">Dane dostawy</h2>
              </div>
              <form id="checkout-form" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">Imię</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface"
                    placeholder="np. Jan"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">Nazwisko</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface" placeholder="np. Kowalski" type="text" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">E-mail (potwierdzenie zamówienia)</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface" placeholder="jan@example.com" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">Adres dostawy</label>
                  <input required value={address} onChange={(e) => setAddress(e.target.value)} className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface" placeholder="Ulica i numer" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">Miasto</label>
                  <input required value={city} onChange={(e) => setCity(e.target.value)} className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface" placeholder="np. Warszawa" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant px-1">Kod pocztowy</label>
                  <input required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="bg-soft-mint rounded-xl px-4 py-3 border-none input-focus-effect transition-all text-on-surface" placeholder="np. 00-001" type="text" />
                </div>
              </form>
            </section>

            {/* Dostawa */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-montserrat text-2xl font-semibold">Metoda dostawy</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { id: "courier" as Delivery, icon: "local_shipping", label: "Kurier DPD", sub: "1–2 dni robocze · Bezpłatna" },
                  { id: "inpost" as Delivery, icon: "inventory_2", label: "InPost Paczkomat", sub: "1–2 dni robocze · Bezpłatna" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDelivery(opt.id)}
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
              {delivery === "inpost" && (
                <InPostWidget onSelect={(locker) => console.log("Wybrany paczkomat:", locker.name)} />
              )}
            </section>

            {/* Metoda płatności */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-tech-blue text-white flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="font-montserrat text-2xl font-semibold">Metoda płatności</h2>
              </div>
              <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
                {amountGrosze > 0 ? (
                  <StripeProvider amount={amountGrosze}>
                    <StripeCheckoutForm
                      totalGrosze={amountGrosze}
                      email={email}
                      firstName={firstName}
                      metadata={{
                        customer_name: `${firstName} ${lastName}`.trim(),
                        customer_email: email,
                        address_line1: address,
                        city,
                        postal_code: postalCode,
                        order_number: genOrderNumber(),
                        items_json: JSON.stringify(items.map(({ product, qty }) => ({
                          name: product.name, subtitle: product.subtitle, qty, price: product.price,
                        }))),
                      }}
                      onSuccess={sendConfirmation}
                    />
                  </StripeProvider>
                ) : (
                  <p className="text-sm text-on-surface-variant text-center py-4">Koszyk jest pusty.</p>
                )}
              </div>
            </section>

            {/* Odznaki bezpieczeństwa */}
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
          </div>

          {/* Prawa strona: podsumowanie */}
          <aside className="lg:w-[400px] mt-12 lg:mt-0">
            <div className="sticky top-32">
              <div className="bg-white rounded-[24px] border border-outline-variant/10 shadow-[0px_4px_20px_rgba(37,37,55,0.04)] overflow-hidden">
                <div className="p-8 bg-tech-blue">
                  <h3 className="font-montserrat text-2xl font-semibold text-white">Twoje zamówienie</h3>
                  <p className="text-on-primary-container text-xs mt-1">Zamówienie #GS-882190</p>
                </div>
                <div className="p-8 space-y-6">
                  {items.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <p className="text-on-surface-variant text-sm">Koszyk jest pusty.</p>
                      <Link href="/shop" className="text-secondary font-semibold text-sm hover:underline">
                        Wróć do sklepu
                      </Link>
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
                    <div className="flex justify-between text-base text-on-surface-variant"><span>Dostawa</span><span className="text-vibrant-teal font-semibold">Bezpłatna</span></div>
                    <div className="flex justify-between font-montserrat text-xl font-bold text-primary pt-2"><span>Razem</span><span>{formatPrice(total)}</span></div>
                  </div>
                  <p className="text-center text-xs text-on-surface-variant px-4">
                    Finalizując zamówienie, akceptujesz nasz{" "}
                    <a className="underline hover:text-vibrant-teal" href="#">Regulamin</a>{" "}
                    i wytyczne zdrowotne.
                  </p>
                </div>
              </div>
              {/* Gwarancja */}
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

      {/* Stopka uproszczona */}
      <footer className="bg-tech-blue py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</div>
          <div className="flex gap-8">
            {["Polityka prywatności", "Badania naukowe", "Kontakt"].map((l) => (
              <a key={l} className="text-on-primary-container hover:text-white transition-colors text-xs font-semibold" href="#">{l}</a>
            ))}
          </div>
          <p className="text-on-primary-container text-xs">© 2024 GoodStim. Technologia VNS klasy medycznej.</p>
        </div>
      </footer>
    </div>
  );
}
