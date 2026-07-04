// Historyczny zapis cen — każdy realny wpis obniżki dopisujemy tu jako nowy element (nie nadpisujemy).
// Na tej podstawie getOmnibusReferencePrice() wylicza "najniższą cenę z 30 dni" wymaganą przez dyrektywę Omnibus.
export type PricePoint = { price: number; from: string };

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  category: "device" | "accessory";
  description: string;
  badge?: string;
  comingSoon?: boolean;
  priceHistory?: PricePoint[];
};

export const PRODUCTS: Product[] = [
  {
    id: "vns-one",
    name: "GoodStim VNS One",
    subtitle: "Edycja Deep Relax",
    price: 550,
    image: "/product.png",
    category: "device",
    description: "Zaawansowany stymulator nerwu błędnego. 4 tryby, certyfikaty CE / FCC / RoHS.",
    badge: "Bestseller",
  },
  {
    id: "gel-2pack",
    name: "Żel przewodzący",
    subtitle: "2-pak · 2 x 100 ml",
    price: 34,
    image: "/product.png",
    category: "accessory",
    description: "Żel zoptymalizowany pod stymulację tVNS. Zapas na ok. 2 miesiące codziennego użytkowania.",
    comingSoon: true,
  },
  {
    id: "gel-6pack",
    name: "Żel przewodzący",
    subtitle: "6-pak · Zestaw 6 miesięcy",
    price: 89,
    image: "/product.png",
    category: "accessory",
    description: "Ekonomiczny zestaw na 6 miesięcy. Oszczędzasz 13 zł vs 3 x 2-pak.",
    badge: "Oszczędny",
    comingSoon: true,
  },
  {
    id: "travel-case",
    name: "Etui podróżne GoodStim",
    subtitle: "Twarde etui ochronne",
    price: 79,
    image: "/case/1.avif",
    category: "accessory",
    description: "Wytrzymałe etui do bezpiecznego przechowywania i transportu GoodStim VNS One wraz z akcesoriami.",
    comingSoon: true,
  },
];

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(price);

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getAccessories = () => PRODUCTS.filter((p) => p.category === "accessory");

// Zgodnie z art. 4a ustawy o informowaniu o cenach towarów i usług (implementacja dyrektywy Omnibus):
// przy informowaniu o obniżce ceny trzeba pokazać najniższą cenę z 30 dni przed jej wprowadzeniem
// (a jeśli produkt jest w sprzedaży krócej niż 30 dni — najniższą cenę od dnia wprowadzenia go do sprzedaży).
// Zwraca null, gdy produkt nie ma udokumentowanej historii cen albo aktualna cena nie jest realną obniżką
// — w takich wypadkach obowiązek ustawowy się nie aktualizuje i nic nie powinno się wyświetlać.
export const getOmnibusReferencePrice = (product: Product): number | null => {
  const history = product.priceHistory;
  if (!history || history.length < 2) return null;

  const sorted = [...history].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
  const current = sorted[sorted.length - 1];
  const launchDate = new Date(sorted[0].from);
  const reductionDate = new Date(current.from);

  const thirtyDaysBefore = new Date(reductionDate);
  thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);
  const windowStart = thirtyDaysBefore > launchDate ? thirtyDaysBefore : launchDate;

  // Każdy wcześniejszy wpis obowiązywał od swojej daty do daty kolejnego wpisu — liczy się,
  // czy ten przedział nachodzi na okno [windowStart, reductionDate), a nie sama data jego rozpoczęcia.
  const priorPrices: number[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const entryStart = new Date(sorted[i].from);
    const entryEnd = new Date(sorted[i + 1].from);
    if (entryEnd > windowStart && entryStart < reductionDate) {
      priorPrices.push(sorted[i].price);
    }
  }
  if (priorPrices.length === 0) return null;

  const lowest = Math.min(...priorPrices);
  return lowest > current.price ? lowest : null;
};
