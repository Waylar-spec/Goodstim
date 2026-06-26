import Icon from "./Icon";

const MODES = [
  {
    icon: "spa",
    name: "Relaksacja",
    tagline: "Po intensywnym dniu",
    desc: "Wspiera szybkie przejście w stan spokoju. Użytkownicy zgłaszają redukcję napięcia mięśniowego i uczucie wyciszenia już w trakcie sesji.",
    bg: "bg-soft-mint",
    iconBg: "bg-white",
    iconColor: "text-secondary",
    headColor: "text-primary",
    subColor: "text-outline",
    bodyColor: "text-on-surface-variant",
    timeColor: "text-secondary",
    dark: false,
  },
  {
    icon: "bedtime",
    name: "Sen",
    tagline: "Przed snem",
    desc: "Może pomóc w zasypianiu i poprawie ciągłości snu. Szczególnie polecany osobom z trudnościami w wyciszeniu myśli wieczorami.",
    bg: "bg-tech-blue",
    iconBg: "bg-white/10",
    iconColor: "text-vibrant-teal",
    headColor: "text-white",
    subColor: "text-white/50",
    bodyColor: "text-white/70",
    timeColor: "text-vibrant-teal",
    dark: true,
  },
  {
    icon: "psychology",
    name: "Skupienie",
    tagline: "Przed ważnym projektem",
    desc: "Wspiera stan skupienia i klarowności umysłu bez efektu pobudzenia. Użytkownicy zgłaszają poprawę koncentracji po regularnym stosowaniu.",
    bg: "bg-surface-container-low",
    iconBg: "bg-white",
    iconColor: "text-tech-blue",
    headColor: "text-primary",
    subColor: "text-outline",
    bodyColor: "text-on-surface-variant",
    timeColor: "text-secondary",
    dark: false,
  },
  {
    icon: "fitness_center",
    name: "Regeneracja",
    tagline: "Po treningu",
    desc: "Stosowany po wysiłku fizycznym wspiera procesy regeneracyjne. Szczególnie ceniony przez sportowców i osoby aktywne fizycznie.",
    bg: "bg-primary",
    iconBg: "bg-white/10",
    iconColor: "text-vibrant-teal",
    headColor: "text-white",
    subColor: "text-white/50",
    bodyColor: "text-white/70",
    timeColor: "text-vibrant-teal",
    dark: true,
  },
] as const;

export default function ModesSection() {
  return (
    <section className="py-32 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-3 py-1 bg-soft-mint text-secondary text-xs font-semibold tracking-widest rounded-full uppercase">
            4 tryby stymulacji
          </span>
          <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-primary">
            Jeden program na każdą potrzebę
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Pilot dołączony do zestawu pozwala przełączać tryby jednym
            przyciskiem — bez potrzeby aplikacji.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODES.map((mode) => (
            <div
              key={mode.name}
              className={`${mode.bg} rounded-[24px] p-8 flex flex-col gap-5 transition-transform hover:-translate-y-1`}
            >
              <div
                className={`w-12 h-12 rounded-2xl ${mode.iconBg} flex items-center justify-center`}
              >
                <Icon name={mode.icon} className={`${mode.iconColor} text-2xl`} fill />
              </div>
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${mode.subColor}`}
                >
                  {mode.tagline}
                </span>
                <h3
                  className={`font-montserrat text-xl font-semibold mt-1 ${mode.headColor}`}
                >
                  {mode.name}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed ${mode.bodyColor} flex-1`}>
                {mode.desc}
              </p>
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold ${mode.timeColor}`}
              >
                <Icon name="timer" className="text-[16px]" />
                Sesja 20 min
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
