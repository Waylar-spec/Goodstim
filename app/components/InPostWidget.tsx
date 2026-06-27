"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

interface Locker {
  name: string;
  address: { line1: string; city: string };
}

interface Props {
  onSelect: (locker: Locker) => void;
  selected?: Locker | null;
}

// v5 GeoWidget point payload (event.detail)
interface GeoPoint {
  name: string;
  address?: { line1?: string; line2?: string };
  address_details?: { city?: string };
}

function ensureAssets(token: string) {
  if (!document.getElementById("inpost-css")) {
    const link = document.createElement("link");
    link.id = "inpost-css";
    link.rel = "stylesheet";
    link.href = "https://geowidget.inpost.pl/inpost-geowidget.css";
    document.head.appendChild(link);
  }
  if (!document.getElementById("inpost-js")) {
    const script = document.createElement("script");
    script.id = "inpost-js";
    script.src = "https://geowidget.inpost.pl/inpost-geowidget.js";
    script.defer = true;
    document.head.appendChild(script);
  }
}

export default function InPostWidget({ onSelect, selected: selectedProp }: Props) {
  const selected = selectedProp ?? null;
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!open) return;

    const token = process.env.NEXT_PUBLIC_INPOST_TOKEN ?? "";
    if (!token) { setLoadError(true); return; }
    if (typeof window === "undefined" || !("customElements" in window)) { setLoadError(true); return; }

    setLoaded(false);
    setLoadError(false);
    ensureAssets(token);

    let widget: HTMLElement | null = null;
    let cancelled = false;

    const handlePoint = (e: Event) => {
      const detail = (e as CustomEvent<GeoPoint>).detail;
      if (!detail) return;
      onSelectRef.current({
        name: detail.name,
        address: {
          line1: detail.address?.line1 ?? "",
          city: detail.address_details?.city ?? detail.address?.line2 ?? "",
        },
      });
      setOpen(false);
    };

    // Fail-safe: if the custom element never registers, show error
    const errTimer = setTimeout(() => { if (!cancelled && !loaded) setLoadError(true); }, 10000);

    window.customElements
      .whenDefined("inpost-geowidget")
      .then(() => {
        if (cancelled || !containerRef.current) return;
        clearTimeout(errTimer);

        widget = document.createElement("inpost-geowidget");
        widget.setAttribute("token", token);
        widget.setAttribute("language", "pl");
        widget.setAttribute("config", "parcelCollect");
        widget.setAttribute("onpoint", "onpointselect");
        widget.style.width = "100%";
        widget.style.height = "500px";
        widget.style.display = "block";
        widget.addEventListener("onpointselect", handlePoint);

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(widget);
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) setLoadError(true); });

    return () => {
      cancelled = true;
      clearTimeout(errTimer);
      if (widget) widget.removeEventListener("onpointselect", handlePoint);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [open, loaded]);

  return (
    <div className="space-y-3">
      {selected ? (
        <div className="flex items-center justify-between p-4 bg-soft-mint rounded-xl border border-vibrant-teal/30">
          <div className="flex items-center gap-3">
            <Icon name="inventory_2" className="text-secondary" />
            <div>
              <p className="text-sm font-semibold text-primary">Paczkomat {selected.name}</p>
              <p className="text-xs text-on-surface-variant">
                {selected.address?.line1}{selected.address?.city ? `, ${selected.address.city}` : ""}
              </p>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="text-xs text-secondary font-semibold hover:underline">Zmień</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 p-4 bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 hover:border-secondary rounded-xl transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-soft-mint flex items-center justify-center group-hover:bg-vibrant-teal/20 transition-colors flex-shrink-0">
            <Icon name="location_on" className="text-secondary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-primary">Wybierz paczkomat na mapie</p>
            <p className="text-xs text-on-surface-variant">Ponad 20 000 punktów w Polsce</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant ml-auto" />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h3 className="font-montserrat font-semibold text-primary">Wybierz paczkomat InPost</h3>
              <button type="button" onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[500px]">
              {loadError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-center px-8 bg-white">
                  <Icon name="wifi_off" className="text-[32px]" />
                  <p className="text-sm">Nie można załadować mapy.<br />Wybierz dostawę kurierem lub odśwież stronę.</p>
                </div>
              )}

              {!loaded && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                    <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Ładowanie mapy…</p>
                  </div>
                </div>
              )}

              <div ref={containerRef} className="w-full h-full min-h-[500px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
