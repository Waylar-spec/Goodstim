"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const COOKIE_NAME = "gs_ref";
const COOKIE_DAYS = 30;

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;
    const code = ref.trim().toUpperCase().slice(0, 20);
    if (!/^[A-Z0-9]+$/.test(code)) return;

    const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${code}; expires=${expires}; path=/; SameSite=Lax`;
  }, [searchParams]);

  return null;
}
