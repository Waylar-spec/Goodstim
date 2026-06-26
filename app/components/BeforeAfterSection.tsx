import Icon from "./Icon";

const PERSONAS = [
  {
    icon: "work",
    label: "Zapracowany profesjonalista",
    without: [
      "Trudności z wyciszeniem po pracy",
      "Wieczorna nerwowość i napięcie",
      "Problemy z koncentracją w ciągu dnia",
      "Szybkie wyczerpanie i wypalenie",
    ],
    with: [
      "Szybsze przejście w stan relaksu po pracy",
      "Spokojniejsze wieczory — mniej wieczornego niepokoju",
      "Lepsza koncentracja na codziennych zadaniach",
      "Użytkownicy zgłaszają więcej energii",
    ],
  },
  {
    icon: "bedtime",
    label: "Problemy ze snem",
    without: [
      "Długie zasypianie — 30–60 min lub więcej",
      "Budzenie się w nocy",
      "Poranne zmęczenie mimo 8h snu",
      "Telefon jako wieczorny rytuał",
    ],
    with: [
      "Użytkownicy zgłaszają krótszy czas zasypiania",
      "Głębszy, bardziej ciągły sen",
      "Bardziej wypoczęte poranki",
      "Naturalny rytuał przed snem bez ekranu",
    ],
  },
  {
    icon: "fitness_center",
    label: "Sportowiec / aktywny",
    without: [
      "Długi czas regeneracji po treningu",
      "Trudności z relaksem po intensywnym wysiłku",
      "Napięcie mięśniowe utrzymujące się długo",
      "Słabszy sen po zawodach / ciężkich treningach",
    ],
    with: [
      "Może wspierać szybszą regenerację po wysiłku",
      "Relaks układu nerwowego po treningu",
      "Zmniejszone odczuwalne napięcie mięśniowe",
      "Użytkownicy zgłaszają lepszy sen po zawodach",
    ],
  },
] as const;

export default function BeforeAfterSection() {
  return (
    <section className="py-32 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
            Co się zmienia?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Trzy typowe profile użytkowników i jak opisują swoje doświadczenia
            po regularnym stosowaniu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PERSONAS.map((p) => (
            <div
              key={p.label}
              className="rounded-[24px] overflow-hidden border border-outline-variant/20 shadow-sm bg-white"
            >
              {/* Nagłówek karty */}
              <div className="bg-tech-blue p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={p.icon} className="text-vibrant-teal" fill />
                </div>
                <h3 className="font-montserrat text-base font-semibold text-white leading-snug">
                  {p.label}
                </h3>
              </div>

              {/* Kolumny przed / po */}
              <div className="grid grid-cols-2 divide-x divide-outline-variant/20">
                {/* BEZ */}
                <div className="p-5 space-y-3 bg-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-error/70 flex items-center gap-1.5">
                    <Icon name="remove_circle" className="text-[14px] text-error/70" fill />
                    Bez
                  </p>
                  <ul className="space-y-2.5">
                    {p.without.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-on-surface-variant leading-snug flex gap-2"
                      >
                        <span className="text-error/50 flex-shrink-0 mt-0.5">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Z GOODSTIM */}
                <div className="p-5 space-y-3 bg-soft-mint">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
                    <Icon name="check_circle" className="text-[14px] text-secondary" fill />
                    Z GoodStim
                  </p>
                  <ul className="space-y-2.5">
                    {p.with.map((item) => (
                      <li
                        key={item}
                        className="text-xs text-on-surface-variant leading-snug flex gap-2"
                      >
                        <span className="text-secondary flex-shrink-0 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-on-surface-variant/50 mt-10 max-w-2xl mx-auto">
          * Opisy oparte na raportowanych doświadczeniach użytkowników. GoodStim
          nie jest wyrobem medycznym i nie zastępuje porady lekarskiej.
        </p>
      </div>
    </section>
  );
}
