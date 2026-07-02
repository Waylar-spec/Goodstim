// Program afiliacyjny GoodStim — struktura poziomów wzorowana na programie ambasadorskim Formeds,
// przeskalowana do jednego produktu w cenie 550 zł. Poziom liczony ze skumulowanej sprzedaży
// od początku współpracy (tylko w górę — raz zdobyty poziom nie spada).

export type Tier = { name: string; rate: number; minUnits: number };

export const TIERS: Tier[] = [
  { name: "Start", rate: 0.10, minUnits: 0 },
  { name: "Silver", rate: 0.15, minUnits: 5 },
  { name: "Gold", rate: 0.20, minUnits: 12 },
  { name: "Diamond", rate: 0.25, minUnits: 25 },
];

export function getTier(totalUnits: number): Tier {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (totalUnits >= t.minUnits) current = t;
  }
  return current;
}

export function getNextTier(totalUnits: number): Tier | null {
  const current = getTier(totalUnits);
  const idx = TIERS.findIndex(t => t.name === current.name);
  return TIERS[idx + 1] ?? null;
}

export function genAffiliateCode(name: string): string {
  const base = name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/[^A-Z]/g, "")
    .slice(0, 8) || "GOODSTIM";
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${base}${suffix}`;
}
