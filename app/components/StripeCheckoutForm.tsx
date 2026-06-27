"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Icon from "./Icon";

interface Props {
  totalGrosze: number;
  email: string;
  firstName: string;
  metadata?: Record<string, string>;
  onSuccess: () => void;
}

export default function StripeCheckoutForm({ totalGrosze, email, firstName, metadata, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    // Krok 1: waliduj dane karty w Elements
    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setError(submitErr.message ?? "Sprawdź dane karty");
      setLoading(false);
      return;
    }

    // Krok 2: utwórz PI z metadanymi zamówienia
    const intentRes = await fetch("/api/stripe/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalGrosze, metadata }),
    });
    const { clientSecret, error: intentErr } = await intentRes.json();
    if (intentErr || !clientSecret) {
      setError("Nie udało się przygotować płatności. Spróbuj ponownie.");
      setLoading(false);
      return;
    }

    // Krok 3: potwierdź płatność
    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: { name: firstName, email },
        },
      },
      redirect: "if_required",
    });

    if (confirmErr) {
      setError(confirmErr.message ?? "Błąd płatności. Spróbuj ponownie.");
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { name: "never", email: "never" } },
          wallets: { applePay: "never", googlePay: "never" },
        }}
      />
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <Icon name="error_outline" className="text-[16px]" />
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-tech-blue text-white py-5 rounded-2xl font-semibold text-sm tracking-wide transition-all shadow-lg hover:bg-primary flex items-center justify-center gap-2 active:scale-[0.98] btn-press disabled:opacity-60"
      >
        <Icon name={loading ? "hourglass_empty" : "lock"} className="text-[20px]" />
        {loading ? "Przetwarzam płatność..." : "Zapłać bezpiecznie"}
      </button>
    </form>
  );
}
