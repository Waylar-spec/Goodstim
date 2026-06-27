"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("gs_exit_shown")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !shown.current) {
        shown.current = true;
        sessionStorage.setItem("gs_exit_shown", "1");
        setVisible(true);
      }
    }

    // Mobile: trigger after 45s of inactivity
    let timer: ReturnType<typeof setTimeout>;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      timer = setTimeout(() => {
        if (!shown.current) {
          shown.current = true;
          sessionStorage.setItem("gs_exit_shown", "1");
          setVisible(true);
        }
      }, 45000);
    } else {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  function copy() {
    navigator.clipboard.writeText("GOODSTIM10").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setVisible(false)}>
      <div
        className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-tech-blue to-primary px-8 py-8 text-center">
          <p className="text-sm font-semibold text-vibrant-teal uppercase tracking-widest mb-2">Zanim odejdziesz</p>
          <h2 className="font-montserrat text-3xl font-bold text-white leading-tight">
            10% rabatu<br />tylko dla Ciebie
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-7 text-center">
          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Wpisz kod przy zamówieniu i oszczędź <strong className="text-primary">55 PLN</strong> na GoodStim VNS One.
          </p>

          <button
            onClick={copy}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-vibrant-teal bg-soft-mint/30 hover:bg-soft-mint/50 transition-colors group"
          >
            <span className="font-montserrat text-2xl font-bold tracking-widest text-primary">GOODSTIM10</span>
            <span className="text-xs font-semibold text-vibrant-teal flex items-center gap-1">
              <Icon name={copied ? "check_circle" : "content_copy"} className="text-[16px]" />
              {copied ? "Skopiowano!" : "Kopiuj"}
            </span>
          </button>

          <a
            href="/shop"
            className="mt-4 w-full bg-tech-blue text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-lg"
            onClick={() => setVisible(false)}
          >
            <Icon name="shopping_bag" className="text-[18px]" />
            Zamów teraz ze zniżką
          </a>

          <button onClick={() => setVisible(false)} className="mt-4 text-xs text-on-surface-variant hover:text-on-surface transition-colors">
            Nie, dziękuję
          </button>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <Icon name="close" className="text-[22px]" />
        </button>
      </div>
    </div>
  );
}
