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

export default function InPostWidget({ onSelect, selected: selectedProp }: Props) {
  const [open, setOpen] = useState(false);
  const selected = selectedProp ?? null;
  const [loaded, setLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = process.env.NEXT_PUBLIC_INPOST_TOKEN ?? "";

    if (!document.getElementById("inpost-css")) {
      const link = document.createElement("link");
      link.id = "inpost-css";
      link.rel = "stylesheet";
      link.href = "https://geowidget.inpost.pl/inpost-geowidget.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("inpost-js")) {
      window.easyPackAsyncInit = () => {
        window.easyPack?.init({ defaultLocale: "pl", mapType: "osm", searchType: "osm", points: { types: ["parcel_locker"] }, map: { initialTypes: ["parcel_locker"] } });
        setLoaded(true);
      };
      const script = document.createElement("script");
      script.id = "inpost-js";
      script.src = `https://geowidget.inpost.pl/inpost-geowidget.js?token=${token}`;
      script.async = true;
      document.body.appendChild(script);
    } else if (window.easyPack) {
      setLoaded(true);
    }
  }, []);

  function openMap() {
    setOpen(true);
    if (!loaded || !window.easyPack) return;
    setTimeout(() => {
      if (!mapRef.current) return;
      widgetRef.current = window.easyPack.mapWidget("inpost-map", (point: Locker) => {
        setOpen(false);
        onSelect(point);
      });
    }, 100);
  }

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
          <button onClick={openMap} className="text-xs text-secondary font-semibold hover:underline">
            Zmień
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openMap}
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <h3 className="font-montserrat font-semibold text-primary">Wybierz paczkomat InPost</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>
            {!loaded && (
              <div className="flex-1 flex items-center justify-center py-16 text-on-surface-variant text-sm">
                <p>Ładowanie mapy… Upewnij się, że masz skonfigurowany token InPost.</p>
              </div>
            )}
            <div id="inpost-map" ref={mapRef} style={{ height: "500px", width: "100%" }} />
          </div>
        </div>
      )}
    </div>
  );
}
