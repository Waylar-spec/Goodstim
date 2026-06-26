"use client";
import { useState } from "react";
import Icon from "./Icon";

export default function UrgencyBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-vibrant-teal text-tech-blue py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold relative">
      <Icon name="local_offer" className="text-[18px] flex-shrink-0" fill />
      <span className="text-center">
        Premiera GoodStim — <strong>10% rabatu</strong> dla pierwszych 100 klientów · Kod:{" "}
        <span className="bg-tech-blue text-vibrant-teal px-2 py-0.5 rounded font-mono text-xs font-bold">PREMIERA10</span>
        {" "}· Darmowa dostawa
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 text-tech-blue/70 hover:text-tech-blue transition-colors"
        aria-label="Zamknij"
      >
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
}
