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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    easyPackAsyncInit?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    easyPack?: any;
  }
}

const INPOST_CONFIG = {
  defaultLocale: "pl",
  mapType: "osm",
  searchType: "osm",
  points: { types: ["parcel_locker"] },
  map: { initialTypes: ["parcel_locker"] },
};

export default function InPostWidget({ onSelect, selected: selectedProp }: Props) {
  const selected = selectedProp ?? null;
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mapRendered = useRef(false);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_INPOST_TOKEN ?? "";
    if (!token) { setLoadError(true); return; }

    // Already initialized
    if (window.easyPack) { setLoaded(true); return; }

    // CSS
    if (!document.getElementById("inpost-css")) {
      const link = document.createElement("link");
      link.id = "inpost-css";
      link.rel = "stylesheet";
      link.href = "https://geowidget.inpost.pl/inpost-geowidget.css";
      document.head.appendChild(link);
    }

    function onReady(setLoadedFn: (v: boolean) => void, setErrorFn: (v: boolean) => void) {
      // Poll until window.easyPack appears (max 8s)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.easyPack) {
          clearInterval(interval);
          try { window.easyPack.init(INPOST_CONFIG); } catch {}
          setLoadedFn(true);
        } else if (attempts > 80) {
          clearInterval(interval);
          setErrorFn(true);
        }
      }, 100);
    }

    const existing = document.getElementById("inpost-js");
    if (existing) {
      onReady(setLoaded, setLoadError);
      return;
    }

    const script = document.createElement("script");
    script.id = "inpost-js";
    script.src = "https://geowidget.inpost.pl/inpost-geowidget.js";
    script.setAttribute("token", token);
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => onReady(setLoaded, setLoadError));
    script.addEventListener("error", () => setLoadError(true));
    document.body.appendChild(script);
  }, []);

  // Render map when modal opens and script is ready
  useEffect(() => {
    if (!open || !loaded || mapRendered.current) return;
    mapRendered.current = true;
    const t = setTimeout(() => {
      if (!window.easyPack) return;
      try {
        window.easyPack.mapWidget("inpost-map", (point: Locker) => {
          setOpen(false);
          mapRendered.current = false;
          onSelectRef.current(point);
        });
      } catch {}
    }, 200);
    return () => clearTimeout(t);
  }, [open, loaded]);

  useEffect(() => { if (!open) mapRendered.current = false; }, [open]);

  return (
    <div className="space-y-3">
      {selected ? (
        <div className="flex items-center justify-between p-4 bg-soft-mint rounded-xl border border-vibrant-teal/30">
          <div className="flex items-center gap-3">
            <Icon name="inventory_2" className="text-secondary" />
            <div>
              <p className="text-sm font-semibold text-primary">{selected.name}</p>
              <p className="text-xs text-on-surface-variant">
                {selected.address?.line1}, {selected.address?.city}
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
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-montserrat font-semibold text-primary">Wybierz paczkomat InPost</h3>
              <button type="button" onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <Icon name="close" />
              </button>
            </div>

            {loadError && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant text-center px-8">
                <Icon name="wifi_off" className="text-[32px]" />
                <p className="text-sm">Nie można załadować mapy.<br />Wybierz dostawę kurierem lub odśwież stronę.</p>
              </div>
            )}

            {!loaded && !loadError && (
              <div className="flex-1 flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                  <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Ładowanie mapy…</p>
                </div>
              </div>
            )}

            <div
              id="inpost-map"
              style={{ height: "500px", width: "100%", display: loaded && !loadError ? "block" : "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
