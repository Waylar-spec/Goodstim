"use client";

import { CartProvider } from "../lib/cart";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "./SmoothScroll";
import CookieBanner from "./CookieBanner";
import ExitIntentPopup from "./ExitIntentPopup";
import SocialProof from "./SocialProof";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SmoothScroll>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              borderRadius: "16px",
              border: "1px solid var(--color-outline-variant)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#fff" },
            },
          }}
        />
        <CookieBanner />
        <ExitIntentPopup />
        <SocialProof />
      </SmoothScroll>
    </CartProvider>
  );
}
