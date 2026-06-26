import Icon from "./Icon";

const CERTS = [
  {
    icon: "verified",
    color: "text-blue-500",
    name: "CE — Dyrektywa EMC",
    standard: "2014/30/EU · EN55032 · EN55035",
    desc: "Spełnia europejskie normy kompatybilności elektromagnetycznej. Urządzenie dopuszczone do obrotu w Polsce i całej Unii Europejskiej.",
  },
  {
    icon: "eco",
    color: "text-secondary",
    name: "RoHS",
    standard: "Dyrektywa 2011/65/EU",
    desc: "Materiały nie zawierają szkodliwych substancji: ołowiu, rtęci ani kadmu. Bezpieczne dla użytkownika i przyjazne środowisku.",
  },
  {
    icon: "signal_cellular_alt",
    color: "text-vibrant-teal",
    name: "FCC Part 15 Class B",
    standard: "Federal Communications Commission",
    desc: "Certyfikat Federalnej Komisji Łączności USA. Emisja radiowa urządzenia mieści się w obowiązujących normach bezpieczeństwa.",
  },
  {
    icon: "battery_charging_full",
    color: "text-on-surface-variant",
    name: "Bateria UN38.3",
    standard: "Transport Safety",
    desc: "Bateria 500 mAh przeszła testy transportowe ONZ. Bezpieczna w transporcie lotniczym i lądowym na całym świecie.",
  },
] as const;

export default function CertsSection() {
  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Lewa kolumna */}
          <div className="lg:w-80 flex-shrink-0 space-y-5">
            <h2 className="font-montserrat text-[28px] leading-[36px] font-semibold text-primary">
              Certyfikaty i zgodność
            </h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              GoodStim to urządzenie wellness — nie wyrób medyczny. Posiada
              certyfikaty potwierdzające bezpieczeństwo materiałów i zgodność
              elektromagnetyczną wymagane do sprzedaży w Polsce i krajach UE.
            </p>
            <div className="flex items-center gap-2 bg-soft-mint rounded-xl px-4 py-3 text-sm font-semibold text-secondary">
              <Icon name="shield" className="text-[20px] flex-shrink-0" fill />
              Dokumentacja certyfikatów dostępna na żądanie
            </div>
          </div>

          {/* Siatka certyfikatów */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CERTS.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-[20px] p-6 border border-outline-variant/20 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon name={c.icon} className={`text-3xl ${c.color}`} fill />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-montserrat text-base font-semibold text-primary">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-outline uppercase tracking-wider font-semibold">
                    {c.standard}
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed pt-1">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
