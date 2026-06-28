"use client";
import { useEffect, useState, useMemo } from "react";
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
  company_name: string;
  nip: string;
  invoice_type: string;
  items: { name: string; qty: number; price: number }[];
  total_pln: string;
  tracking_number: string | null;
  shipment_id: string | null;
  notes: string | null;
  created_at: string;
  stripe_payment_intent_id: string;
};

const PER_PAGE = 15;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:        { label: "Nowe",         color: "bg-blue-500/20 text-blue-300" },
  processing: { label: "W realizacji", color: "bg-yellow-500/20 text-yellow-300" },
  shipped:    { label: "Wysłane",      color: "bg-green-500/20 text-green-300" },
  delivered:  { label: "Dostarczone",  color: "bg-gray-500/20 text-gray-300" },
  cancelled:  { label: "Anulowane",   color: "bg-red-500/20 text-red-300" },
};

function getPeriodRange(period: string, customFrom: string, customTo: string): [Date, Date] {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  if (period === "custom" && customFrom && customTo) {
    return [new Date(customFrom + "T00:00:00"), new Date(customTo + "T23:59:59")];
  }
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  from.setDate(from.getDate() - days + 1);
  return [from, to];
}

function pctChange(current: number, prev: number) {
  if (prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

function Delta({ current, prev }: { current: number; prev: number }) {
  const p = pctChange(current, prev);
  if (p === null) return null;
  const up = p >= 0;
  return (
    <span className={`text-xs font-semibold ml-1 ${up ? "text-green-400" : "text-red-400"}`}>
      {up ? "▲" : "▼"} {Math.abs(p).toFixed(0)}%
    </span>
  );
}

function BarChart({ buckets, valueKey, color }: {
  buckets: { label: string; revenue: number; count: number }[];
  valueKey: "revenue" | "count";
  color: string;
}) {
  const values = buckets.map(b => b[valueKey]);
  const max = Math.max(...values, 1);
  const H = 80;

  return (
    <svg viewBox={`0 0 ${buckets.length * 10} ${H + 12}`} className="w-full" preserveAspectRatio="none">
      {buckets.map((b, i) => {
        const h = Math.max((b[valueKey] / max) * H, b[valueKey] > 0 ? 2 : 0);
        return (
          <g key={b.label}>
            <rect
              x={i * 10 + 1} y={H - h} width={8} height={h}
              fill={color} rx={1} opacity={0.85}
            >
              <title>
                {b.label}: {valueKey === "revenue" ? `${b.revenue.toFixed(2)} PLN` : `${b.count} zam.`}
              </title>
            </rect>
          </g>
        );
      })}
    </svg>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [labelLoading, setLabelLoading] = useState(false);
  const [labelMsg, setLabelMsg] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<"orders" | "analytics">("orders");
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "custom">("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

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

  async function saveNotes(order: Order) {
    setNotesSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, notes: notesDraft }),
    });
    setOrders(o => o.map(x => x.id === order.id ? { ...x, notes: notesDraft } : x));
    if (selected?.id === order.id) setSelected(s => s ? { ...s, notes: notesDraft } : s);
    setNotesSaving(false);
  }

  function exportCSV() {
    const cols = ["ID", "Zamówienie", "Data", "Status", "Klient", "Email", "Telefon", "Dostawa", "Paczkomat/Adres", "Faktura", "NIP", "Firma", "Śledzenie", "Kwota (PLN)"];
    const rows = orders.map(o => [
      o.id, o.order_number,
      new Date(o.created_at).toLocaleString("pl-PL"),
      o.status, o.customer_name, o.customer_email, o.customer_phone ?? "",
      o.delivery_method === "inpost" ? "InPost Paczkomat" : "InPost Kurier",
      o.inpost_locker || `${o.address_line1}, ${o.city} ${o.postal_code}`.trim(),
      o.invoice_type === "invoice" ? "Faktura" : "Paragon",
      o.nip ?? "", o.company_name ?? "", o.tracking_number ?? "",
      parseFloat(o.total_pln).toFixed(2),
    ]);
    const csv = [cols, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `goodstim-zamowienia-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  async function clearAllOrders() {
    if (!confirm("Usuń WSZYSTKIE zamówienia? Tej operacji nie można cofnąć.")) return;
    const res = await fetch("/api/admin/orders/clear", { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      alert(`Usunięto ${data.deleted} zamówień.`);
      load();
      setSelected(null);
    } else {
      alert("Błąd: " + data.error);
    }
  }

  // Orders tab
  const q = search.trim().toLowerCase();
  const filtered = orders
    .filter(o => filter === "all" || o.status === filter)
    .filter(o => !q || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) || (o.customer_phone ?? "").includes(q) || o.order_number.toLowerCase().includes(q));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const paged = filtered.slice((pageClamped - 1) * PER_PAGE, pageClamped * PER_PAGE);

  // Analytics computations
  const analytics = useMemo(() => {
    const [from, to] = getPeriodRange(period, customFrom, customTo);
    const spanMs = to.getTime() - from.getTime();
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(prevTo.getTime() - spanMs);

    const cur = orders.filter(o => { const d = new Date(o.created_at); return d >= from && d <= to; });
    const prev = orders.filter(o => { const d = new Date(o.created_at); return d >= prevFrom && d <= prevTo; });

    const revenue = cur.reduce((s, o) => s + parseFloat(o.total_pln), 0);
    const prevRevenue = prev.reduce((s, o) => s + parseFloat(o.total_pln), 0);
    const count = cur.length;
    const prevCount = prev.length;
    const aov = count > 0 ? revenue / count : 0;
    const prevAov = prevCount > 0 ? prevRevenue / prevCount : 0;
    const pending = cur.filter(o => o.status === "new").length;

    // Daily buckets
    const dayMs = 24 * 60 * 60 * 1000;
    const buckets: { label: string; date: string; revenue: number; count: number }[] = [];
    const spanDays = Math.round(spanMs / dayMs);
    // If range > 60 days, group by week
    const groupByWeek = spanDays > 60;

    if (groupByWeek) {
      // group by ISO week
      const weekMap: Record<string, { revenue: number; count: number; label: string }> = {};
      cur.forEach(o => {
        const d = new Date(o.created_at);
        const week = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() - d.getDay() + 10) / 7)).padStart(2, "0")}`;
        if (!weekMap[week]) weekMap[week] = { revenue: 0, count: 0, label: `Tydz. ${week.split("-W")[1]}` };
        weekMap[week].revenue += parseFloat(o.total_pln);
        weekMap[week].count++;
      });
      Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b)).forEach(([k, v]) => {
        buckets.push({ label: v.label, date: k, revenue: v.revenue, count: v.count });
      });
    } else {
      const d = new Date(from);
      while (d <= to) {
        const key = d.toISOString().slice(0, 10);
        const dayOrders = cur.filter(o => o.created_at.slice(0, 10) === key);
        const shortLabel = `${d.getDate()}.${d.getMonth() + 1}`;
        buckets.push({ label: shortLabel, date: key, revenue: dayOrders.reduce((s, o) => s + parseFloat(o.total_pln), 0), count: dayOrders.length });
        d.setDate(d.getDate() + 1);
      }
    }

    // Status breakdown
    const byStatus: Record<string, number> = {};
    cur.forEach(o => { byStatus[o.status] = (byStatus[o.status] ?? 0) + 1; });

    // Delivery breakdown
    const byDelivery = {
      inpost: cur.filter(o => o.delivery_method === "inpost").length,
      courier: cur.filter(o => o.delivery_method !== "inpost").length,
    };

    // Top products
    const productMap: Record<string, { qty: number; revenue: number }> = {};
    cur.forEach(o => {
      (o.items || []).forEach(item => {
        if (!productMap[item.name]) productMap[item.name] = { qty: 0, revenue: 0 };
        productMap[item.name].qty += item.qty ?? 1;
        productMap[item.name].revenue += (item.price ?? 0) * (item.qty ?? 1);
      });
    });
    const topProducts = Object.entries(productMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Best day of week
    const dow: Record<number, { revenue: number; count: number }> = {};
    cur.forEach(o => {
      const d = new Date(o.created_at).getDay();
      if (!dow[d]) dow[d] = { revenue: 0, count: 0 };
      dow[d].revenue += parseFloat(o.total_pln);
      dow[d].count++;
    });

    return { revenue, prevRevenue, count, prevCount, aov, prevAov, pending, buckets, byStatus, byDelivery, topProducts, dow, spanDays };
  }, [orders, period, customFrom, customTo]);

  const DOW_LABELS = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg">GoodStim</span>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">Admin</span>
          {/* Main tabs */}
          <div className="flex gap-1 ml-4">
            {(["orders", "analytics"] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveMainTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeMainTab === t ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {t === "orders" ? "Zamówienia" : "Analityka"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={clearAllOrders} className="text-xs text-red-500 hover:text-red-400 transition-colors border border-red-500/30 hover:border-red-400/50 px-3 py-1 rounded-lg">
            🗑 Wyczyść zamówienia
          </button>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">Wyloguj</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── ORDERS TAB ─── */}
        {activeMainTab === "orders" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Wszystkich zamówień", value: orders.length },
                { label: "Nowych (do wysyłki)", value: orders.filter(o => o.status === "new").length, highlight: orders.filter(o => o.status === "new").length > 0 },
                { label: "Łączny przychód", value: `${orders.reduce((s, o) => s + parseFloat(o.total_pln), 0).toFixed(2)} PLN` },
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
                <div className="flex gap-3 mb-4">
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Szukaj: imię, email, telefon, nr zamówienia…"
                    className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                  />
                  <button onClick={exportCSV} className="px-4 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
                    ⬇ Eksport CSV
                  </button>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
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
                        <button key={o.id}
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
                              <p className="text-xs text-gray-500 mt-0.5">{new Date(o.created_at).toLocaleString("pl-PL")}</p>
                            </div>
                            <span className="text-sm font-bold text-green-400 shrink-0">{parseFloat(o.total_pln).toFixed(2)} PLN</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!loading && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={pageClamped <= 1}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111827] text-gray-300 disabled:opacity-40 hover:text-white transition-colors">
                      ← Poprzednia
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === pageClamped ? "bg-blue-600 text-white" : "bg-[#111827] text-gray-400 hover:text-white"}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={pageClamped >= totalPages}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111827] text-gray-300 disabled:opacity-40 hover:text-white transition-colors">
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
                  {selected.invoice_type === "invoice" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2 text-xs text-yellow-300">
                      <strong>Faktura VAT</strong> — {selected.company_name || "—"} · NIP: {selected.nip || "—"}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
                        <button key={key} onClick={() => setStatus(selected.id, key)}
                          className={`text-xs py-2 px-3 rounded-lg border transition-colors ${selected.status === key ? `${color} border-current` : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Klient</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-white">{selected.customer_name}</p>
                      <p className="text-gray-300">{selected.customer_email}</p>
                      {selected.customer_phone && <p className="text-gray-300">{selected.customer_phone}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Dostawa</p>
                    <div className="text-sm space-y-1">
                      <p className="text-white font-semibold">
                        {selected.delivery_method === "inpost" ? "InPost Paczkomat" : "InPost Kurier"}
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
                  {selected.tracking_number && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Numer śledzenia</p>
                      <p className="font-mono text-sm text-green-400">{selected.tracking_number}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Notatki (wewnętrzne)</p>
                    <textarea
                      rows={3}
                      value={notesDraft !== "" || selected.notes === null ? notesDraft : (selected.notes ?? "")}
                      onFocus={() => setNotesDraft(selected.notes ?? "")}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="Wpisz notatkę do zamówienia…"
                      className="w-full bg-[#0d1524] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-blue-500 resize-none transition-colors"
                    />
                    <button onClick={() => saveNotes(selected)} disabled={notesSaving}
                      className="mt-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors">
                      {notesSaving ? "Zapisuję…" : "Zapisz notatkę"}
                    </button>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    {selected.delivery_method === "inpost" && !selected.tracking_number && (
                      <button onClick={() => createLabel(selected)} disabled={labelLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl text-sm transition-colors">
                        {labelLoading ? "Tworzę etykietę…" : "🏷️ Utwórz etykietę InPost"}
                      </button>
                    )}
                    {selected.shipment_id && (
                      <a href={`/api/admin/label/download?order_id=${selected.id}`} target="_blank" rel="noreferrer"
                        className="w-full block text-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                        ⬇️ Pobierz etykietę (PDF)
                      </a>
                    )}
                    {labelMsg && <p className="text-xs text-center text-gray-300">{labelMsg}</p>}
                    <a href={`https://dashboard.stripe.com/payments/${selected.stripe_payment_intent_id}`}
                      target="_blank" rel="noreferrer"
                      className="w-full block text-center bg-[#1a2336] hover:bg-[#1e2a42] border border-white/10 text-gray-300 py-2.5 rounded-xl text-sm transition-colors">
                      Otwórz w Stripe →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── ANALYTICS TAB ─── */}
        {activeMainTab === "analytics" && (
          <div className="space-y-6">
            {/* Period selector */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 p-1 bg-[#111827] rounded-xl border border-white/10">
                {(["7d", "30d", "90d"] as const).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${period === p ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                    {p === "7d" ? "7 dni" : p === "30d" ? "30 dni" : "90 dni"}
                  </button>
                ))}
                <button onClick={() => setPeriod("custom")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${period === "custom" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
                  Własny
                </button>
              </div>
              {period === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500" />
                  <span className="text-gray-500">—</span>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                    className="bg-[#111827] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {analytics.buckets.length > 0
                  ? `${analytics.spanDays} dni · ${analytics.count} zamówień`
                  : "Wybierz okres"}
              </span>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Przychód", icon: "💰",
                  value: `${analytics.revenue.toFixed(2)} PLN`,
                  delta: <Delta current={analytics.revenue} prev={analytics.prevRevenue} />,
                  sub: `poprzednio: ${analytics.prevRevenue.toFixed(0)} PLN`,
                },
                {
                  label: "Zamówienia", icon: "📦",
                  value: analytics.count,
                  delta: <Delta current={analytics.count} prev={analytics.prevCount} />,
                  sub: `poprzednio: ${analytics.prevCount}`,
                },
                {
                  label: "Śr. zamówienie", icon: "🎯",
                  value: `${analytics.aov.toFixed(2)} PLN`,
                  delta: <Delta current={analytics.aov} prev={analytics.prevAov} />,
                  sub: `poprzednio: ${analytics.prevAov.toFixed(0)} PLN`,
                },
                {
                  label: "Oczekujące", icon: "⏳",
                  value: analytics.pending,
                  delta: null,
                  sub: "nowe do wysyłki",
                  highlight: analytics.pending > 0,
                },
              ].map(card => (
                <div key={card.label} className={`rounded-2xl p-5 border ${card.highlight ? "bg-blue-600/10 border-blue-500/30" : "bg-[#111827] border-white/10"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-400">{card.label}</p>
                    <span className="text-lg">{card.icon}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-2xl font-bold ${card.highlight ? "text-blue-400" : "text-white"}`}>{card.value}</p>
                    {card.delta}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Revenue chart */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-200">Przychód w czasie</p>
                  <p className="text-xs text-gray-500">{analytics.spanDays > 60 ? "grupowane tygodniowo" : "dziennie"}</p>
                </div>
                {analytics.buckets.length > 0 ? (
                  <>
                    <BarChart buckets={analytics.buckets} valueKey="revenue" color="#3b82f6" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>{analytics.buckets[0]?.label}</span>
                      {analytics.buckets.length > 4 && <span>{analytics.buckets[Math.floor(analytics.buckets.length / 2)]?.label}</span>}
                      <span>{analytics.buckets[analytics.buckets.length - 1]?.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Maks: {Math.max(...analytics.buckets.map(b => b.revenue)).toFixed(0)} PLN ·
                      Śr: {(analytics.revenue / Math.max(analytics.buckets.filter(b => b.revenue > 0).length, 1)).toFixed(0)} PLN/dzień
                    </p>
                  </>
                ) : <p className="text-xs text-gray-500 py-8 text-center">Brak danych w wybranym okresie</p>}
              </div>

              {/* Orders count chart */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-gray-200">Liczba zamówień</p>
                  <p className="text-xs text-gray-500">łącznie: {analytics.count}</p>
                </div>
                {analytics.buckets.length > 0 ? (
                  <>
                    <BarChart buckets={analytics.buckets} valueKey="count" color="#10b981" />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>{analytics.buckets[0]?.label}</span>
                      {analytics.buckets.length > 4 && <span>{analytics.buckets[Math.floor(analytics.buckets.length / 2)]?.label}</span>}
                      <span>{analytics.buckets[analytics.buckets.length - 1]?.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Maks: {Math.max(...analytics.buckets.map(b => b.count))} zam./dzień
                    </p>
                  </>
                ) : <p className="text-xs text-gray-500 py-8 text-center">Brak danych w wybranym okresie</p>}
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Status breakdown */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-semibold text-gray-200">Status zamówień</p>
                {analytics.count === 0 ? (
                  <p className="text-xs text-gray-500">Brak danych</p>
                ) : Object.entries(STATUS_LABELS).map(([key, { label, color }]) => {
                  const n = analytics.byStatus[key] ?? 0;
                  const pct = analytics.count > 0 ? (n / analytics.count) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{label}</span>
                        <span className="text-white font-semibold">{n} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery breakdown */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-semibold text-gray-200">Metoda dostawy</p>
                {analytics.count === 0 ? (
                  <p className="text-xs text-gray-500">Brak danych</p>
                ) : [
                  { label: "InPost Paczkomat", n: analytics.byDelivery.inpost, color: "bg-yellow-500" },
                  { label: "InPost Kurier", n: analytics.byDelivery.courier, color: "bg-blue-500" },
                ].map(d => {
                  const pct = analytics.count > 0 ? (d.n / analytics.count) * 100 : 0;
                  return (
                    <div key={d.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{d.label}</span>
                        <span className="text-white font-semibold">{d.n} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm font-semibold text-gray-200 mb-3">Aktywność wg dnia</p>
                  <div className="flex gap-1 items-end h-10">
                    {DOW_LABELS.map((d, i) => {
                      const val = analytics.dow[i]?.revenue ?? 0;
                      const maxDow = Math.max(...Object.values(analytics.dow).map(v => v.revenue), 1);
                      return (
                        <div key={d} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-purple-500/70 rounded-sm" style={{ height: `${(val / maxDow) * 32}px`, minHeight: val > 0 ? "2px" : "0" }} title={`${d}: ${val.toFixed(0)} PLN`} />
                          <span className="text-[9px] text-gray-500">{d}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top products */}
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-4">
                <p className="text-sm font-semibold text-gray-200">Produkty w zamówieniach</p>
                {analytics.topProducts.length === 0 ? (
                  <p className="text-xs text-gray-500">Brak danych</p>
                ) : analytics.topProducts.map((p, i) => {
                  const maxRev = analytics.topProducts[0]?.revenue ?? 1;
                  return (
                    <div key={p.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400 truncate max-w-[160px]" title={p.name}>
                          {i + 1}. {p.name}
                        </span>
                        <span className="text-white font-semibold shrink-0 ml-2">{p.revenue.toFixed(0)} PLN</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">× {p.qty} szt.</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
