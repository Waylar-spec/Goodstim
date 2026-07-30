"use client";
import { useState } from "react";
import Icon from "./Icon";
import { FAQS } from "../lib/faq";

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-32 bg-surface" id="faq">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
            Najczęstsze pytania
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
            Masz inne pytanie?{" "}
            <a href="mailto:kontakt@goodstim.pl" className="text-secondary font-semibold hover:underline">
              Napisz do nas
            </a>{" "}
            — odpowiemy w ciągu 24h.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-[16px] border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-secondary bg-soft-mint"
                    : "border-outline-variant/20 bg-white hover:border-outline-variant/50"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-base leading-snug ${
                      isOpen ? "text-secondary" : "text-primary"
                    }`}
                  >
                    {faq.q}
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
                    <p className="text-base text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
