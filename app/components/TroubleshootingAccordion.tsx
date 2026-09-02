"use client";
import { useState } from "react";
import Icon from "./Icon";

const ITEMS = [
  {
    q: "Urządzenie się nie włącza",
    a: "Sprawdź, czy jest naładowane — pełne ładowanie na stacji magnetycznej zajmuje ok. godziny. Jeśli dioda nie reaguje po godzinie ładowania, spróbuj innego kabla/zasilacza USB-C zanim skontaktujesz się z nami.",
  },
  {
    q: "Nie czuję impulsów albo są bardzo słabe",
    a: "Najczęstsza przyczyna to za mało żelu lub niedokładny kontakt elektrod ze skórą — dołóż żelu i popraw ułożenie urządzenia na szyi. Intensywność zwiększaj stopniowo pilotem lub w aplikacji, zaczynając od najniższego poziomu.",
  },
  {
    q: "Aplikacja nie łączy się z urządzeniem przez Bluetooth",
    a: "Upewnij się, że Bluetooth w telefonie jest włączony, a GoodStim naładowany i włączony. Jeśli parowanie się nie udaje, wyłącz i włącz urządzenie ponownie, a następnie sparuj je od nowa w ustawieniach aplikacji.",
  },
  {
    q: "Skończył się żel przewodzący",
    a: "Uzupełniający żel znajdziesz w naszym sklepie. Do czasu dostawy używaj oszczędniej — cienka warstwa na elektrodach w zupełności wystarczy do sesji.",
  },
  {
    q: "Sesja urwała się w połowie",
    a: "Każdy tryb wyłącza się automatycznie po 4 minutach — to normalne zakończenie, nie awaria. Jeśli urządzenie wyłączyło się wcześniej, sprawdź poziom baterii.",
  },
] as const;

export default function TroubleshootingAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={`rounded-[16px] border overflow-hidden transition-all duration-200 ${
              isOpen ? "border-secondary bg-soft-mint" : "border-outline-variant/20 bg-white hover:border-outline-variant/50"
            }`}
          >
            <button
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={`font-semibold text-base leading-snug ${isOpen ? "text-secondary" : "text-primary"}`}>
                {item.q}
              </span>
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isOpen ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <Icon name={isOpen ? "remove" : "add"} className="text-[18px]" />
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6">
                <p className="text-base text-on-surface-variant leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
