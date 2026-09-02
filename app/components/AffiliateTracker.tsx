"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "gs_ref";
const COOKIE_DAYS = 30;

// Google Ads click ID — kliknięcie z reklamy może dojrzeć do zakupu długo po wejściu na
// stronę, więc łapiemy gclid już na starcie i trzymamy w cookie, żeby checkout mógł go
// odczytać i wysłać razem z serwerową konwersją (patrz webhook Stripe).
const GCLID_COOKIE_NAME = "gs_gclid";
const GCLID_COOKIE_DAYS = 90;

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      const code = ref.trim().toUpperCase().slice(0, 20);
      if (/^[A-Z0-9]+$/.test(code)) {
        const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${COOKIE_NAME}=${code}; expires=${expires}; path=/; SameSite=Lax`;
      }
    }

    const gclid = searchParams.get("gclid");
    if (gclid) {
      const value = gclid.trim().slice(0, 200);
      const expires = new Date(Date.now() + GCLID_COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${GCLID_COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
