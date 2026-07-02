"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type PageState = "loading" | "form" | "already_submitted" | "invalid" | "done";

export default function ReviewPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>("loading");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Sprawdź czy token jest ważny i czy opinia nie została już wysłana
    fetch(`/api/review/check?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === "pending_submission") setState("form");
        else if (data.status === "pending_approval" || data.status === "approved" || data.status === "rejected") setState("already_submitted");
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Wybierz ocenę"); return; }
    if (!name.trim()) { setError("Podaj imię"); return; }
    if (text.trim().length < 10) { setError("Opinia jest za krótka (min. 10 znaków)"); return; }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reviewerName: name, rating, reviewText: text }),
      });

      if (res.ok) {
        setState("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Coś poszło nie tak");
        setSubmitting(false);
      }
    } catch {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">
          {state === "loading" && (
            <div className="text-center text-slate-400 text-lg">Ładowanie...</div>
          )}

          {state === "invalid" && (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">🔗</p>
              <h1 className="text-xl font-bold text-white mb-2">Link jest nieważny</h1>
              <p className="text-slate-400">Ten link do opinii wygasł lub jest nieprawidłowy.</p>
            </div>
          )}

          {state === "already_submitted" && (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">✅</p>
              <h1 className="text-xl font-bold text-white mb-2">Opinia już wysłana</h1>
              <p className="text-slate-400">Dziękujemy! Twoja opinia czeka na zatwierdzenie i wkrótce pojawi się na stronie.</p>
            </div>
          )}

          {state === "done" && (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-5xl mb-4">🙏</p>
              <h1 className="text-2xl font-bold text-white mb-3">Dziękujemy za opinię!</h1>
              <p className="text-slate-400 mb-6">Twoja recenzja pojawi się na stronie po weryfikacji. Bardzo nam pomagasz!</p>
              <a href="https://goodstim.pl" className="inline-block bg-teal-500 text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-teal-400 transition-colors">
                Wróć na stronę →
              </a>
            </div>
          )}

          {state === "form" && (
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest mb-2">GoodStim</p>
                <h1 className="text-2xl font-bold text-white mb-2">Jak oceniasz GoodStim VNS One?</h1>
                <p className="text-slate-400 text-sm">Twoja opinia pojawi się na stronie po weryfikacji</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Gwiazdki */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Ocena ogólna</label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHovered(n)}
                        onMouseLeave={() => setHovered(0)}
                        className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                      >
                        <span className={(hovered || rating) >= n ? "text-yellow-400" : "text-slate-600"}>★</span>
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-sm text-slate-400 mt-2">
                      {["", "Słabo", "Przeciętnie", "Dobrze", "Bardzo dobrze", "Doskonale"][rating]}
                    </p>
                  )}
                </div>

                {/* Imię */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twoje imię</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="np. Katarzyna M."
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    maxLength={50}
                  />
                </div>

                {/* Treść */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Twoja opinia</label>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Opisz swoje doświadczenie z GoodStim VNS One..."
                    rows={5}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs text-slate-500 mt-1 text-right">{text.length}/1000</p>
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-900 font-bold py-4 rounded-xl transition-colors text-lg"
                >
                  {submitting ? "Wysyłanie..." : "Wyślij opinię →"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
