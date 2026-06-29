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
    id: "electrodes",
    name: "Elektrody zapasowe",
    subtitle: "4 szt. · Stal nierdzewna",
    price: 49,
    image: "/product.png",
    category: "accessory",
    description: "Wymienne elektrody ze stali nierdzewnej dedykowane do GoodStim VNS One.",
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
