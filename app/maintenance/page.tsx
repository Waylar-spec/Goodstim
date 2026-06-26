"use client";

import { useState } from "react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/email/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <main className="min-h-screen bg-tech-blue text-white flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Tło — subtelna poświata */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vibrant-teal/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="font-montserrat text-3xl font-bold tracking-tight text-vibrant-teal">
          GoodStim
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-on-primary-container">
          <span className="w-2 h-2 rounded-full bg-vibrant-teal animate-pulse" />
          Wkrótce startujemy
        </div>

        {/* Nagłówek */}
        <h1 className="font-montserrat text-4xl md:text-5xl font-bold leading-tight">
          Pracujemy nad czymś,<br />co Cię wyciszy.
        </h1>

        <p className="text-on-primary-container text-base md:text-lg max-w-md leading-relaxed">
          GoodStim to urządzenie do codziennej stymulacji nerwu błędnego, które wspiera
          regenerację, spokojniejszy sen i równowagę układu nerwowego. Sklep otwieramy
          już niedługo.
        </p>

        {/* Zapis na newsletter */}
        {state === "ok" ? (
          <div className="w-full max-w-md bg-white/5 border border-vibrant-teal/30 rounded-2xl px-6 py-5">
            <p className="text-vibrant-teal font-semibold">Dziękujemy! 🎉</p>
            <p className="text-on-primary-container text-sm mt-1">
              Damy znać jako pierwszym, gdy ruszymy — z kodem rabatowym na start.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój e-mail"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3.5 text-white placeholder:text-white/40 outline-none focus:border-vibrant-teal/60 transition-all"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-vibrant-teal text-tech-blue font-semibold px-7 py-3.5 rounded-full hover:bg-vibrant-teal/90 transition-all active:scale-[0.98] disabled:opacity-60 whitespace-nowrap"
            >
              {state === "loading" ? "Zapisuję…" : "Powiadom mnie"}
            </button>
          </form>
        )}

        {state === "error" && (
          <p className="text-sm text-red-300 -mt-4">Coś poszło nie tak. Spróbuj ponownie za chwilę.</p>
        )}

        <p className="text-xs text-on-primary-container/60 mt-4">
          Kontakt:{" "}
          <a href="mailto:kontakt@goodstim.pl" className="underline hover:text-vibrant-teal transition-colors">
            kontakt@goodstim.pl
          </a>
        </p>
      </div>
    </main>
  );
}
