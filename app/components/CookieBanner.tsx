"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("gs_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("gs_cookie_consent", "all");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("gs_cookie_consent", "necessary");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-on-surface leading-relaxed">
            <span className="font-semibold text-primary">🍪 Używamy cookies</span> do analizy ruchu i personalizacji treści.
            Więcej w{" "}
            <Link href="/polityka-prywatnosci" className="text-vibrant-teal underline">Polityce prywatności</Link>.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-outline-variant/40 text-on-surface-variant hover:bg-surface-variant/30 transition-colors"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-tech-blue text-white hover:bg-primary transition-colors shadow-md"
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}
