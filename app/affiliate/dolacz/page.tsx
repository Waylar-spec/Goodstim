"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Icon from "../../components/Icon";

const PROMOTION_METHODS = [
  { id: "social", label: "Media społecznościowe", desc: "Instagram, TikTok, Facebook, YouTube" },
  { id: "content", label: "Blog / treści", desc: "Recenzje, artykuły, poradniki" },
  { id: "word_of_mouth", label: "Polecenia znajomym", desc: "Bezpośrednie rekomendacje" },
  { id: "other", label: "Inne", desc: "Newsletter, forum, społeczność" },
];

const STEP_LABELS = [
  { n: 1, label: "Twoje dane" },
  { n: 2, label: "Promocja i regulamin" },
  { n: 3, label: "Gotowe" },
];

export default function AffiliateJoinPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [promotionMethod, setPromotionMethod] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  function validateStep1(): string | null {
    if (!name.trim()) return "Podaj imię i nazwisko.";
    if (!email.trim() || !email.includes("@")) return "Podaj prawidłowy adres e-mail.";
    return null;
  }

  function goNext() {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setError("");
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!promotionMethod) { setError("Wybierz sposób promocji."); return; }
    if (!termsAccepted) { setError("Musisz zaakceptować regulamin programu."); return; }

    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, code, promotionMethod, termsAccepted }),
      });

      if (res.ok) {
        setStep(3);
        setState("idle");
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
    <div className="min-h-screen bg-surface text-on-background font-sans">
      <Navbar />

      <main className="pt-20 pb-24 px-6">
        <div className="max-w-lg mx-auto">

          {/* Header */}
          <div className="text-center mb-10 pt-8">
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-2">Program Partnerski</p>
            <h1 className="font-montserrat text-3xl font-bold text-primary">Dołącz do GoodStim</h1>
          </div>

          {/* Stepper */}
          {step < 3 && (
            <div className="flex items-center justify-center mb-12">
              {STEP_LABELS.slice(0, 2).map((s, i) => (
                <div key={s.n} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        step >= s.n ? "bg-tech-blue text-white" : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {step > s.n ? <Icon name="check" className="text-[18px]" /> : s.n}
                    </div>
                    <span className={`text-xs font-medium ${step >= s.n ? "text-primary" : "text-on-surface-variant"}`}>{s.label}</span>
                  </div>
                  {i === 0 && <div className={`w-16 h-0.5 mx-2 mb-5 ${step >= 2 ? "bg-tech-blue" : "bg-surface-container-low"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-[24px] border border-[#E5F6EF] shadow-[0px_4px_20px_rgba(37,37,55,0.04)] p-8 md:p-10">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Imię i nazwisko</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-vibrant-teal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-vibrant-teal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Twój kod (opcjonalnie)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="np. TWOJEIMIE"
                    maxLength={20}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-vibrant-teal transition-colors tracking-widest"
                  />
                  <p className="text-xs text-on-surface-variant mt-1.5">Zostaw puste, a wygenerujemy kod z Twojego imienia.</p>
                </div>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <button
                  onClick={goNext}
                  className="w-full bg-tech-blue hover:scale-[1.02] text-white font-semibold py-4 rounded-xl transition-all text-base btn-press"
                >
                  Dalej →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-3">Jak planujesz promować GoodStim?</label>
                  <div className="space-y-2">
                    {PROMOTION_METHODS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPromotionMethod(m.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                          promotionMethod === m.id
                            ? "border-vibrant-teal bg-soft-mint"
                            : "border-outline-variant/30 hover:border-vibrant-teal/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            promotionMethod === m.id ? "border-secondary" : "border-outline-variant/50"
                          }`}>
                            {promotionMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                          </div>
                          <div>
                            <p className="font-semibold text-primary text-sm">{m.label}</p>
                            <p className="text-xs text-on-surface-variant">{m.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-vibrant-teal flex-shrink-0"
                  />
                  <span className="text-sm text-on-surface-variant leading-snug">
                    Przeczytałem(-am) i akceptuję{" "}
                    <Link href="/affiliate/regulamin" target="_blank" className="text-secondary font-semibold hover:underline">
                      Regulamin Programu Partnerskiego
                    </Link>{" "}
                    GoodStim.
                  </span>
                </label>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="px-6 py-4 border-2 border-tech-blue text-tech-blue font-semibold rounded-xl hover:bg-surface-container-low transition-all"
                  >
                    ← Wstecz
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={state === "loading"}
                    className="flex-1 bg-tech-blue hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 text-white font-semibold py-4 rounded-xl transition-all text-base btn-press"
                  >
                    {state === "loading" ? "Rejestrowanie..." : "Zostań partnerem →"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-soft-mint rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name="mark_email_read" className="text-vibrant-teal text-[28px]" />
                </div>
                <h2 className="font-montserrat text-xl font-semibold text-primary mb-2">Sprawdź skrzynkę!</h2>
                <p className="text-on-surface-variant text-sm mb-6">
                  Wysłaliśmy Ci link do panelu afilianta wraz z Twoim unikalnym linkiem polecającym i kodem rabatowym.
                </p>
                <Link
                  href="/affiliate"
                  className="inline-block bg-tech-blue text-white font-semibold px-6 py-3 rounded-full hover:scale-[1.02] transition-all text-sm"
                >
                  Wróć do programu partnerskiego
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
