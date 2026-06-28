"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  city: string;
  postal_code: string;
  delivery_method: string;
  inpost_locker: string;
  items: { name: string; qty: number; price: number }[];
  total_pln: string;
  tracking_number: string | null;
  shipment_id: string | null;
  created_at: string;
  stripe_payment_intent_id: string;
};

const PER_PAGE = 15;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:        { label: "Nowe",       color: "bg-blue-500/20 text-blue-300" },
  processing: { label: "W realizacji", color: "bg-yellow-500/20 text-yellow-300" },
  shipped:    { label: "Wysłane",    color: "bg-green-500/20 text-green-300" },
  delivered:  { label: "Dostarczone", color: "bg-gray-500/20 text-gray-300" },
  cancelled:  { label: "Anulowane", color: "bg-red-500/20 text-red-300" },
};

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [labelLoading, setLabelLoading] = useState(false);
  const [labelMsg, setLabelMsg] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  async function load() {
    const res = await fetch("/api/admin/orders");
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : s);
  }

  async function createLabel(order: Order) {
    setLabelLoading(true);
    setLabelMsg("");
    const res = await fetch("/api/admin/label", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setLabelMsg(`✅ Etykieta utworzona. Numer: ${data.tracking_number}`);
      load();
    } else {
      setLabelMsg(`❌ ${data.error}`);
    }
    setLabelLoading(false);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const paged = filtered.slice((pageClamped - 1) * PER_PAGE, pageClamped * PER_PAGE);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === "new").length,
    revenue: orders.reduce((s, o) => s + parseFloat(o.total_pln), 0),
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">GoodStim</span>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">Wyloguj</button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Wszystkich zamówień", value: stats.total },
            { label: "Nowych (do wysyłki)", value: stats.new, highlight: stats.new > 0 },
            { label: "Łączny przychód", value: `${stats.revenue.toFixed(2)} PLN` },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 border ${s.highlight ? "bg-blue-600/10 border-blue-500/30" : "bg-[#111827] border-white/10"}`}>
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.highlight ? "text-blue-400" : "text-white"}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Orders list */}
          <div className="flex-1 min-w-0">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {["all", "new", "processing", "shipped", "delivered"].map(f => (
                <button key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-[#111827] text-gray-400 hover:text-white"}`}
                >
                  {f === "all" ? "Wszystkie" : STATUS_LABELS[f]?.label ?? f}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">Ładowanie…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">Brak zamówień</div>
            ) : (
              <div className="space-y-2">
                {paged.map(o => {
                  const st = STATUS_LABELS[o.status] ?? { label: o.status, color: "bg-gray-500/20 text-gray-300" };
                  return (
                    <button
                      key={o.id}
                      onClick={() => { setSelected(o); setLabelMsg(""); }}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${selected?.id === o.id ? "border-blue-500 bg-blue-600/10" : "border-white/10 bg-[#111827] hover:border-white/20"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-bold text-white">{o.order_number}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                            {o.delivery_method === "inpost" && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">Paczkomat</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300">{o.customer_name} · {o.customer_email}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(o.created_at).toLocaleString("pl-PL")}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-400 shrink-0">{parseFloat(o.total_pln).toFixed(2)} PLN</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pageClamped <= 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111827] text-gray-300 disabled:opacity-40 hover:text-white transition-colors"
                >
                  ← Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === pageClamped ? "bg-blue-600 text-white" : "bg-[#111827] text-gray-400 hover:text-white"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={pageClamped >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111827] text-gray-300 disabled:opacity-40 hover:text-white transition-colors"
                >
                  Następna →
                </button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-96 shrink-0 bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-5 self-start sticky top-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">{selected.order_number}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl">×</button>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      onClick={() => setStatus(selected.id, key)}
                      className={`text-xs py-2 px-3 rounded-lg border transition-colors ${selected.status === key ? `${color} border-current` : "border-white/10 text-gray-400 hover:border-white/30"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Klient</p>
                <div className="space-y-1 text-sm">
                  <p className="text-white">{selected.customer_name}</p>
                  <p className="text-gray-300">{selected.customer_email}</p>
                  {selected.customer_phone && <p className="text-gray-300">{selected.customer_phone}</p>}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Dostawa</p>
                <div className="text-sm space-y-1">
                  <p className="text-white font-semibold">
                    {selected.delivery_method === "inpost" ? "InPost Paczkomat" : "Kurier DPD"}
                  </p>
                  {selected.delivery_method === "inpost" ? (
                    <p className="text-gray-300">Paczkomat: {selected.inpost_locker || "—"}</p>
                  ) : (
                    <>
                      <p className="text-gray-300">{selected.address_line1}</p>
                      <p className="text-gray-300">{selected.postal_code} {selected.city}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Produkty</p>
                <div className="space-y-1">
                  {(selected.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name} × {item.qty ?? 1}</span>
                      <span className="text-white">{((item.price ?? 0) * (item.qty ?? 1)).toFixed(2)} PLN</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                    <span>Razem</span>
                    <span className="text-green-400">{parseFloat(selected.total_pln).toFixed(2)} PLN</span>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              {selected.tracking_number && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Numer śledzenia</p>
                  <p className="font-mono text-sm text-green-400">{selected.tracking_number}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                {selected.delivery_method === "inpost" && !selected.tracking_number && (
                  <button
                    onClick={() => createLabel(selected)}
                    disabled={labelLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {labelLoading ? "Tworzę etykietę…" : "🏷️ Utwórz etykietę InPost"}
                  </button>
                )}
                {selected.shipment_id && (
                  <a
                    href={`/api/admin/label/download?order_id=${selected.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block text-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    ⬇️ Pobierz etykietę (PDF)
                  </a>
                )}
                {labelMsg && (
                  <p className="text-xs text-center text-gray-300">{labelMsg}</p>
                )}
                <a
                  href={`https://dashboard.stripe.com/payments/${selected.stripe_payment_intent_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full block text-center bg-[#1a2336] hover:bg-[#1e2a42] border border-white/10 text-gray-300 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Otwórz w Stripe →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
