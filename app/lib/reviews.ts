export type Review = {
  name: string;
  location: string;
  avatar: string;
  text: string;
  date: string;
  rating: number;
};

export const AGGREGATE_RATING = { score: 5.0, count: 50 };

export const REVIEWS: Review[] = [
  {
    name: "Katarzyna M.",
    location: "Warszawa",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    text: "Po 2 tygodniach regularnego stosowania widzę wyraźną różnicę w jakości snu. Zasypianie trwa mi teraz o połowę krócej!",
    date: "Grudzień 2024",
    rating: 5,
  },
  {
    name: "Piotr K.",
    location: "Kraków",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face",
    text: "Byłem sceptyczny, ale po miesiącu używania moje HRV wzrosło o 15 punktów. Polecam każdemu kto dużo pracuje przy komputerze.",
    date: "Styczeń 2025",
    rating: 5,
  },
  {
    name: "Agnieszka W.",
    location: "Gdańsk",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face",
    text: "Używam GoodStim przed medytacją i efekty są nieporównywalne. Znacznie szybciej wchodzę w stan głębokiego spokoju.",
    date: "Luty 2025",
    rating: 5,
  },
  {
    name: "Marek S.",
    location: "Wrocław",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face",
    text: "Cierpię na przewlekły stres zawodowy od lat. GoodStim pomaga mi szybko się wyciszyć — efekty czuję już po kilku minutach.",
    date: "Marzec 2025",
    rating: 5,
  },
  {
    name: "Joanna B.",
    location: "Poznań",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&h=80&fit=crop&crop=face",
    text: "Tryb Deep Sleep co wieczór i wybudzam się naprawdę wypoczęta. Polecam wszystkim z problemami z zasypianiem.",
    date: "Kwiecień 2025",
    rating: 5,
  },
  {
    name: "Tomasz R.",
    location: "Łódź",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face",
    text: "Sprzęt na poziomie produktów ze Stanów, w przystępnej polskiej cenie. Obsługa odpowiedziała w 2 godziny. 10/10.",
    date: "Maj 2025",
    rating: 5,
  },
];
