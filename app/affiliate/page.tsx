"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TIERS } from "../lib/affiliate";

export default function AffiliatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Coś poszło nie tak");
        setState("error");
      }
    } catch {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setState("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        {/* Hero */}
        <section className="px-6 pt-24 pb-16 text-center">
          <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest mb-4">Program Partnerski</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 max-w-2xl mx-auto">
            Zarabiaj polecając GoodStim
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Dostajesz unikalny link. Za każdą sprzedaż z Twojego polecenia otrzymujesz prowizję — od 10% do 25%, im więcej sprzedasz, tym więcej zarabiasz.
          </p>
        </section>

        {/* Tiers */}
        <section className="px-6 pb-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TIERS.map((t, i) => (
              <div key={t.name} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center">
                <p className="text-3xl mb-2">{["🥉", "🥈", "🥇", "💎"][i]}</p>
                <p className="font-bold text-white mb-1">{t.name}</p>
                <p className="text-2xl font-black text-teal-400 mb-2">{(t.rate * 100).toFixed(0)}%</p>
                <p className="text-xs text-slate-500">{t.minUnits === 0 ? "od startu" : `od ${t.minUnits} szt.`}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            Przy cenie 550 zł: Start = 55 zł/sprzedaż, Diamond = 137,50 zł/sprzedaż. Poziom raz zdobyty zostaje na zawsze.
          </p>
        </section>

        {/* Registration form */}
        <section className="px-6 pb-24 max-w-lg mx-auto">
          <div className="bg-slate-800 rounded-2xl p-8">
            {state === "done" ? (
              <div className="text-center py-4">
                <p className="text-5xl mb-4">📬</p>
                <h2 className="text-xl font-bold text-white mb-2">Sprawdź skrzynkę!</h2>
                <p className="text-slate-400 text-sm">Wysłaliśmy Ci link do panelu afilianta wraz z Twoim unikalnym linkiem polecającym.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-white text-center mb-2">Dołącz teraz</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Imię i nazwisko</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-900 font-bold py-4 rounded-xl transition-colors text-lg"
                >
                  {state === "loading" ? "Rejestrowanie..." : "Zostań afiliantem →"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
