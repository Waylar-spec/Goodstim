"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

const MESSAGES = [
  { city: "Warszawa", time: 3, name: "Tomasz W." },
  { city: "Kraków", time: 7, name: "Ania K." },
  { city: "Wrocław", time: 12, name: "Marek S." },
  { city: "Gdańsk", time: 18, name: "Justyna M." },
  { city: "Poznań", time: 24, name: "Piotr L." },
  { city: "Łódź", time: 31, name: "Karolina R." },
  { city: "Katowice", time: 44, name: "Dawid N." },
  { city: "Szczecin", time: 52, name: "Monika T." },
];

export default function SocialProof() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // First show after 8s
    const first = setTimeout(() => show(0), 8000);
    return () => clearTimeout(first);
  }, []);

  function show(i: number) {
    setIndex(i);
    setVisible(true);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      const next = setTimeout(() => show((i + 1) % MESSAGES.length), 12000);
      return () => clearTimeout(next);
    }, 5000);
    return () => clearTimeout(hideTimer);
  }

  const msg = MESSAGES[index];

  return (
    <div
      className={`fixed bottom-24 left-4 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 bg-surface-container border border-outline-variant/20 rounded-2xl shadow-xl px-4 py-3 max-w-[280px]">
        <div className="w-9 h-9 rounded-full bg-soft-mint flex items-center justify-center shrink-0">
          <Icon name="shopping_bag" className="text-[18px] text-vibrant-teal" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-on-surface truncate">{msg.name} z {msg.city}</p>
          <p className="text-xs text-on-surface-variant">kupił(a) GoodStim · {msg.time} min temu</p>
        </div>
      </div>
    </div>
  );
}
