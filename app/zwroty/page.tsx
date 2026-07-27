"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "../components/Logo";

const REASONS = [
  "Produkt nie spełnił oczekiwań",
  "Produkt uszkodzony / wadliwy",
  "Otrzymałem/am zły produkt",
  "Zamówienie pomyłkowe",
  "Inny powód",
];

export default function ZwrotyPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/returns/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, message: data.error ?? "Coś poszło nie tak. Spróbuj ponownie." });
      } else {
        setResult({ ok: true, message: "Zgłoszenie przyjęte! Sprawdź swoją skrzynkę mailową — etykieta zwrotna dotrze w osobnej wiadomości." });
        setOrderNumber("");
        setEmail("");
        setReason(REASONS[0]);
      }
    } catch {
      setResult({ ok: false, message: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie później." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="bg-tech-blue py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo variant="dark" />
          <Link href="/shop" className="text-on-primary-container hover:text-white text-sm font-semibold transition-colors">← Sklep</Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-3">Zwrot zamówienia</h1>
        <p className="text-on-surface-variant mb-10 leading-relaxed">
          Masz 14 dni od otrzymania przesyłki. Wypełnij formularz, a wygenerujemy dla Ciebie darmową etykietę zwrotną InPost — bez konieczności kontaktu mailowego. Pełne warunki znajdziesz w <Link href="/regulamin#zwroty" className="text-primary underline">Regulaminie</Link>.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/5 p-8 space-y-5 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Numer zamówienia</label>
            <input
              required
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="GS-782857"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">E-mail podany przy zamówieniu</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jan@przyklad.pl"
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">Powód zwrotu</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-teal bg-white"
            >
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {result && (
            <div className={`rounded-xl px-4 py-3 text-sm font-medium ${result.ok ? "bg-vibrant-teal/10 text-tech-blue" : "bg-red-50 text-red-600"}`}>
              {result.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-vibrant-teal text-tech-blue font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Wysyłanie..." : "Zgłoś zwrot"}
          </button>
        </form>
      </main>
    </div>
  );
}
