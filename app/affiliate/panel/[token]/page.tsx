"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import toast from "react-hot-toast";

type Tier = { name: string; rate: number; minUnits: number };
type Sale = {
  order_number: string; created_at: string; total_pln: string;
  affiliate_commission_pln: string; affiliate_tier: string; affiliate_payout_status: string;
};
type Stats = {
  name: string; code: string; bankAccount: string | null;
  totalUnitsSold: number; currentTier: Tier; nextTier: Tier | null; unitsToNextTier: number | null;
  totalEarned: number; pending: number; paid: number; sales: Sale[];
};

export default function AffiliatePanelPage() {
  const { token } = useParams<{ token: string }>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [bankAccount, setBankAccount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/affiliate/stats?token=${token}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (data) {
          setStats(data);
          setBankAccount(data.bankAccount ?? "");
        }
        setLoading(false);
      });
  }, [token]);

  const refUrl = stats ? `${typeof window !== "undefined" ? window.location.origin : "https://goodstim.pl"}/?ref=${stats.code}` : "";

  function copyLink() {
    navigator.clipboard.writeText(refUrl);
    toast.success("Link skopiowany!");
  }

  async function saveBankAccount() {
    setSaving(true);
    await fetch("/api/affiliate/stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, bankAccount }),
    });
    toast.success("Zapisano numer konta");
    setSaving(false);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {loading && <p className="text-center text-slate-400">Ładowanie...</p>}
          {notFound && (
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">🔗</p>
              <h1 className="text-xl font-bold text-white mb-2">Link jest nieprawidłowy</h1>
            </div>
          )}

          {stats && (
            <>
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest mb-2">Panel Afilianta</p>
                <h1 className="text-3xl font-black text-white">Cześć, {stats.name.split(" ")[0]}!</h1>
              </div>

              {/* Referral link */}
              <div className="bg-slate-800 rounded-2xl p-6 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Twój link polecający</p>
                <div className="flex gap-2">
                  <input readOnly value={refUrl} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-teal-400 text-sm" />
                  <button onClick={copyLink} className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold px-5 rounded-xl transition-colors">
                    Kopiuj
                  </button>
                </div>
              </div>

              {/* Tier progress */}
              <div className="bg-slate-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Poziom</p>
                    <p className="text-2xl font-black text-white">{stats.currentTier.name} — {(stats.currentTier.rate * 100).toFixed(0)}%</p>
                  </div>
                  <p className="text-3xl">{stats.currentTier.name === "Start" ? "🥉" : stats.currentTier.name === "Silver" ? "🥈" : stats.currentTier.name === "Gold" ? "🥇" : "💎"}</p>
                </div>
                {stats.nextTier ? (
                  <>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (stats.totalUnitsSold / stats.nextTier.minUnits) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Jeszcze {stats.unitsToNextTier} sprzedaż{stats.unitsToNextTier === 1 ? "" : "y"} do poziomu <strong className="text-white">{stats.nextTier.name} ({(stats.nextTier.rate * 100).toFixed(0)}%)</strong>
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-teal-400">🎉 Najwyższy poziom osiągnięty!</p>
                )}
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-2xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Sprzedane szt.</p>
                  <p className="text-2xl font-black text-white">{stats.totalUnitsSold}</p>
                </div>
                <div className="bg-slate-800 rounded-2xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Do wypłaty</p>
                  <p className="text-2xl font-black text-teal-400">{stats.pending.toFixed(2)} zł</p>
                </div>
                <div className="bg-slate-800 rounded-2xl p-5 text-center">
                  <p className="text-xs text-slate-500 mb-1">Łącznie zarobione</p>
                  <p className="text-2xl font-black text-white">{stats.totalEarned.toFixed(2)} zł</p>
                </div>
              </div>

              {/* Bank account */}
              <div className="bg-slate-800 rounded-2xl p-6 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Numer konta do wypłaty</p>
                <div className="flex gap-2">
                  <input
                    value={bankAccount}
                    onChange={e => setBankAccount(e.target.value)}
                    placeholder="PL00 0000 0000 0000 0000 0000 0000"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                  <button onClick={saveBankAccount} disabled={saving} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold px-5 rounded-xl transition-colors">
                    Zapisz
                  </button>
                </div>
                {stats.pending >= 150 && (
                  <p className="text-xs text-teal-400 mt-2">✓ Masz min. 150 zł do wypłaty — możesz poprosić o przelew mailowo.</p>
                )}
                {stats.pending > 0 && stats.pending < 150 && (
                  <p className="text-xs text-slate-500 mt-2">Wypłata możliwa od 150 zł zebranej prowizji.</p>
                )}
              </div>

              {/* Sales history */}
              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Historia sprzedaży</p>
                {stats.sales.length === 0 ? (
                  <p className="text-slate-500 text-sm">Brak sprzedaży jeszcze. Udostępnij swój link!</p>
                ) : (
                  <div className="space-y-2">
                    {stats.sales.map(s => (
                      <div key={s.order_number} className="flex items-center justify-between text-sm border-b border-slate-700 pb-2 last:border-0">
                        <div>
                          <p className="text-white font-medium">#{s.order_number}</p>
                          <p className="text-xs text-slate-500">{new Date(s.created_at).toLocaleDateString("pl-PL")} · {s.affiliate_tier}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-teal-400 font-bold">+{parseFloat(s.affiliate_commission_pln).toFixed(2)} zł</p>
                          <p className="text-xs text-slate-500">{s.affiliate_payout_status === "paid" ? "Wypłacono" : "Oczekuje"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
