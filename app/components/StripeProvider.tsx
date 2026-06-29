"use client";

import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  children: React.ReactNode;
  amount: number;
}

export default function StripeProvider({ children, amount }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount,
        currency: "pln",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0057B8",
            colorBackground: "#f7fdf9",
            colorText: "#252537",
            borderRadius: "12px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
