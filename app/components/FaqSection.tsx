"use client";
import { useState } from "react";
import Icon from "./Icon";

const FAQS = [
  {
    q: "Jak działa stymulator nerwu błędnego?",
    a: "Urządzenie wytwarza delikatne impulsy elektryczne o niskim natężeniu (0–10 mA), które przykłada się do skóry szyi w miejscu przebiegu nerwu błędnego. Nerw błędny łączy mózg z wieloma narządami wewnętrznymi i odgrywa kluczową rolę w regulacji układu autonomicznego. Stymulacja wspiera aktywację układu przywspółczulnego — odpowiedzialnego za stan odpoczynku i regeneracji.",
  },
  {
    q: "Czy urządzenie jest bezpieczne?",
    a: "GoodStim pracuje na napięciu DC 5V, a natężenie prądu regulowane jest w zakresie 0–10 mA. Posiada certyfikaty CE (Dyrektywa EMC 2014/30/EU) oraz FCC Part 15 Class B. Jest to urządzenie wellness — nie jest wyrobem medycznym i nie zastępuje konsultacji lekarskiej.",
  },
  {
    q: "Dla kogo jest przeznaczone?",
    a: "GoodStim jest przeznaczony dla dorosłych, którzy chcą wspierać relaksację, jakość snu, koncentrację lub regenerację po wysiłku fizycznym. Typowi użytkownicy to zapracowani profesjonaliści szukający wyciszenia po pracy, osoby z trudnościami ze snem oraz sportowcy zainteresowani optymalizacją regeneracji.",
  },
  {
    q: "Kto NIE powinien używać urządzenia?",
    a: "Urządzenia nie zalecamy osobom z wszczepionym rozrusznikiem serca lub innymi aktywnymi implantami elektronicznymi, kobietom w ciąży, osobom po operacjach szyi lub z chorobami naczyniowymi szyi, a także osobom chorującym na epilepsję. W razie jakichkolwiek wątpliwości dotyczących stanu zdrowia — skonsultuj się z lekarzem przed użyciem.",
  },
  {
    q: "Jakie certyfikaty posiada urządzenie?",
    a: "GoodStim posiada certyfikat CE zgodny z Dyrektywą EMC 2014/30/EU (normy EN55032, EN55035), certyfikat RoHS (2011/65/EU) potwierdzający brak szkodliwych substancji w materiałach, certyfikat FCC Part 15 Class B oraz certyfikat baterii UN38.3 wymagany dla bezpiecznego transportu lotniczego.",
  },
  {
    q: "Ile trwa sesja i jak często można używać?",
    a: "Każdy tryb to sesja 20-minutowa — urządzenie wyłącza się automatycznie po jej zakończeniu. Większość użytkowników stosuje 1–2 sesje dziennie. Zalecamy zaczynać od najniższego poziomu intensywności i stopniowo go zwiększać zgodnie z własnym komfortem.",
  },
  {
    q: "Jak długo ładuje się bateria i ile sesji wytrzyma?",
    a: "Bateria 500 mAh ładuje się w ok. 1 godziny przez standardowy port USB. Naładowana bateria wystarczy na kilka sesji — dokładny czas zależy od wybranego trybu i poziomu intensywności. Kabel ładujący USB jest dołączony do zestawu.",
  },
  {
    q: "Jaka jest polityka zwrotów?",
    a: "Oferujemy 30-dniową gwarancję — jeśli urządzenie nie spełni Twoich oczekiwań, skontaktuj się z nami w ciągu 30 dni od zakupu. Zwrot lub wymiana bez zbędnych formalności. Szczegóły dostępne w Polityce zwrotów.",
  },
] as const;

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
            <a href="#" className="text-secondary font-semibold hover:underline">
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
