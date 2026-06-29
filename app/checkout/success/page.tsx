"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Icon from "../../components/Icon";
import { useCart } from "../../lib/cart";
import { trackPurchase } from "../../lib/analytics";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type View = "loading" | "success" | "processing" | "failed" | "none";

function SuccessInner() {
  const params = useSearchParams();
  const { items, clearCart } = useCart();
  const [view, setView] = useState<View>("loading");

  useEffect(() => {
    const clientSecret = params.get("payment_intent_client_secret");
    if (!clientSecret) { setView("none"); return; }

    let cancelled = false;
    (async () => {
      const stripe = await stripePromise;
      if (!stripe) { if (!cancelled) setView("none"); return; }

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      if (cancelled) return;

      const status = paymentIntent?.status;
      const piId = paymentIntent?.id ?? "";

      if (status === "succeeded" || status === "processing") {
        setView(status === "succeeded" ? "success" : "processing");

        // GA4 purchase — raz na płatność (guard po ID intentu)
        const guardKey = `gs_purchase_${piId}`;
        if (piId && typeof window !== "undefined" && !sessionStorage.getItem(guardKey)) {
          sessionStorage.setItem(guardKey, "1");
          trackPurchase(
            piId,
            (paymentIntent?.amount ?? 0) / 100,
            items.map(({ product, qty }) => ({ name: product.name, qty, price: product.price }))
          );
        }
        clearCart();
      } else {
        setView("failed");
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans flex flex-col">
      <header className="w-full border-b border-surface-variant/20 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 md:px-16 h-20">
          <Link href="/" className="font-montserrat text-2xl font-bold tracking-tight text-primary">GoodStim</Link>
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant text-sm font-semibold">
            <Icon name="lock" className="text-[20px]" />
            <span>Bezpieczna płatność</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        {view === "loading" && (
          <div className="flex flex-col items-center gap-4 text-on-surface-variant">
            <Icon name="hourglass_empty" className="text-4xl animate-pulse" />
            <p className="text-sm font-semibold">Weryfikuję płatność…</p>
          </div>
        )}

        {(view === "success" || view === "processing") && (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-soft-mint rounded-full flex items-center justify-center">
              <Icon name="check_circle" className="text-secondary text-5xl" fill />
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-primary">
              {view === "success" ? "Dziękujemy za zamówienie!" : "Płatność w trakcie potwierdzania"}
            </h1>
            <p className="text-on-surface-variant">
              {view === "success"
                ? "Twoja płatność została zaksięgowana. Potwierdzenie zamówienia wysłaliśmy na Twój e-mail. Paczka wyruszy w ciągu 1–2 dni roboczych."
                : "Otrzymaliśmy Twoją płatność i czekamy na ostateczne potwierdzenie z banku. Gdy tylko wpłynie, wyślemy Ci e-mail z potwierdzeniem zamówienia."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/" className="px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-all">
                Wróć na stronę główną
              </Link>
              <Link href="/shop" className="px-8 py-4 border-2 border-tech-blue text-tech-blue rounded-full font-semibold text-sm hover:bg-tech-blue hover:text-white transition-all">
                Wróć do sklepu
              </Link>
            </div>
          </div>
        )}

        {view === "failed" && (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <Icon name="error_outline" className="text-red-500 text-5xl" />
            </div>
            <h1 className="font-montserrat text-3xl font-bold text-primary">Płatność nie powiodła się</h1>
            <p className="text-on-surface-variant">
              Twoja płatność nie została zrealizowana. Nie pobraliśmy żadnych środków. Spróbuj ponownie lub wybierz inną metodę płatności.
            </p>
            <Link href="/checkout" className="px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-all">
              Spróbuj ponownie
            </Link>
          </div>
        )}

        {view === "none" && (
          <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center">
              <Icon name="shopping_bag" className="text-on-surface-variant text-4xl" />
            </div>
            <h1 className="font-montserrat text-2xl font-bold text-primary">Brak danych płatności</h1>
            <p className="text-on-surface-variant">Nie znaleźliśmy informacji o płatności. Jeśli właśnie złożyłeś zamówienie, sprawdź swoją skrzynkę e-mail.</p>
            <Link href="/shop" className="px-8 py-4 bg-tech-blue text-white rounded-full font-semibold text-sm hover:bg-primary transition-all">
              Przejdź do sklepu
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <SuccessInner />
    </Suspense>
  );
}
