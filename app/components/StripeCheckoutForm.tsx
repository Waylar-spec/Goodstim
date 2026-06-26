"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import type { PaymentRequest } from "@stripe/stripe-js";
import Icon from "./Icon";

interface Props {
  totalGrosze: number;
  email: string;
  firstName: string;
  onSuccess: () => void;
}

export default function StripeCheckoutForm({ totalGrosze, email, firstName, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe || !totalGrosze) return;
    const pr = stripe.paymentRequest({
      country: "PL",
      currency: "pln",
      total: { label: "GoodStim VNS One", amount: totalGrosze },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
    pr.on("paymentmethod", async (e) => {
      const res = await fetch("/api/stripe/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalGrosze,
          metadata: { customer_email: email, customer_name: firstName },
        }),
      });
      const { clientSecret, error: fetchErr } = await res.json();
      if (fetchErr) { e.complete("fail"); return; }

      const { error: confirmErr } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: e.paymentMethod.id,
      }, { handleActions: false });

      if (confirmErr) {
        e.complete("fail");
        setError(confirmErr.message ?? "Błąd płatności");
      } else {
        e.complete("success");
        onSuccess();
      }
    });
  }, [stripe, totalGrosze, email, firstName, onSuccess]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    // Confirm payment — Elements handles the PI internally (mode: "payment")
    const { error: submitErr } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: { name: firstName, email },
        },
      },
      redirect: "if_required",
    });

    if (submitErr) {
      setError(submitErr.message ?? "Błąd płatności");
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="space-y-6">
      {paymentRequest && (
        <div className="space-y-3">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: { type: "buy", theme: "dark", height: "56px" },
              },
            }}
          />
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-outline-variant/30" />
            <span className="text-xs text-on-surface-variant font-semibold">lub zapłać kartą</span>
            <hr className="flex-1 border-outline-variant/30" />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { name: "never", email: "never" } },
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
    </div>
  );
}
