export type Review = {
  name: string;
  location: string;
  text: string;
  date: string;
  rating: number;
};

export const REVIEWS: Review[] = [
  {
    name: "Katarzyna M.",
    location: "Warszawa",
    text: "Po 2 tygodniach regularnego stosowania widzę wyraźną różnicę w jakości snu. Zasypianie trwa mi teraz o połowę krócej!",
    date: "Grudzień 2024",
    rating: 5,
  },
  {
    name: "Piotr K.",
    location: "Kraków",
    text: "Byłem sceptyczny, ale po miesiącu używania czuję się zauważalnie spokojniejszy. Polecam każdemu kto dużo pracuje przy komputerze.",
    date: "Styczeń 2025",
    rating: 5,
  },
  {
    name: "Agnieszka W.",
    location: "Gdańsk",
    text: "Używam GoodStim przed medytacją i efekty są nieporównywalne. Znacznie szybciej wchodzę w stan głębokiego spokoju.",
    date: "Luty 2025",
    rating: 5,
  },
  {
    name: "Marek S.",
    location: "Wrocław",
    text: "Cierpię na przewlekły stres zawodowy od lat. GoodStim pomaga mi szybko się wyciszyć — efekty czuję już po kilku minutach.",
    date: "Marzec 2025",
    rating: 5,
  },
  {
    name: "Joanna B.",
    location: "Poznań",
    text: "Tryb Deep Sleep co wieczór i wybudzam się naprawdę wypoczęta. Polecam wszystkim z problemami z zasypianiem.",
    date: "Kwiecień 2025",
    rating: 5,
  },
  {
    name: "Tomasz R.",
    location: "Łódź",
    text: "Sprzęt na poziomie produktów ze Stanów, w przystępnej polskiej cenie. Obsługa odpowiedziała w 2 godziny. 10/10.",
    date: "Maj 2025",
    rating: 5,
  },
  {
    name: "Magdalena T.",
    location: "Szczecin",
    text: "Bardzo dobry sprzęt, jedyny minus to że aplikacja czasem gubi połączenie Bluetooth. Poza tym pełna satysfakcja.",
    date: "Czerwiec 2025",
    rating: 4,
  },
  {
    name: "Adam Sz.",
    location: "Bydgoszcz",
    text: "Zabieram etui z GoodStim w każdą podróż służbową. 15 minut w hotelowym pokoju i wieczorne spotkania są dużo mniej stresujące.",
    date: "Lipiec 2025",
    rating: 5,
  },
  {
    name: "Ewa N.",
    location: "Lublin",
    text: "Tryb Focus włączam przed dłuższą pracą koncepcyjną — łatwiej mi się skupić i nie rozpraszam się co chwilę telefonem.",
    date: "Sierpień 2025",
    rating: 5,
  },
  {
    name: "Krzysztof D.",
    location: "Białystok",
    text: "Aplikacja prosta w obsłudze, urządzenie wygodne na szyi nawet po godzinie noszenia. Bateria wytrzymuje spokojnie tydzień.",
    date: "Wrzesień 2025",
    rating: 5,
  },
  {
    name: "Natalia P.",
    location: "Katowice",
    text: "Miałam problem z zasypianiem po nocnych zmianach w pracy. Od kiedy stosuję GoodStim wieczorami, zasypiam zauważalnie szybciej.",
    date: "Październik 2025",
    rating: 5,
  },
  {
    name: "Michał G.",
    location: "Gdynia",
    text: "Po treningach czuję się szybciej zregenerowany, a wieczorem łatwiej mi wyłączyć myśli o pracy. Dobra inwestycja.",
    date: "Listopad 2025",
    rating: 5,
  },
  {
    name: "Aleksandra K.",
    location: "Częstochowa",
    text: "Solidne wykonanie i przyjemny w dotyku silikon. Chciałabym tylko, żeby ładowanie trwało trochę krócej.",
    date: "Grudzień 2025",
    rating: 4,
  },
  {
    name: "Paweł W.",
    location: "Radom",
    text: "Używam przed ważnymi spotkaniami i prezentacjami — pomaga mi wejść w spokojniejszy stan zamiast się nakręcać ze stresu.",
    date: "Styczeń 2026",
    rating: 5,
  },
  {
    name: "Monika Ł.",
    location: "Toruń",
    text: "Prosta rzecz, a robi różnicę — 4 minuty wieczorem i śpię spokojniej całą noc. Polecam osobom z natłokiem myśli przed snem.",
    date: "Luty 2026",
    rating: 5,
  },
  {
    name: "Grzegorz F.",
    location: "Kielce",
    text: "Kupiłem po poleceniu kolegi. Na początku nie byłem przekonany, ale po trzech tygodniach regularnego użytkowania czuję różnicę.",
    date: "Marzec 2026",
    rating: 5,
  },
  {
    name: "Karolina Sz.",
    location: "Rzeszów",
    text: "Świetne uzupełnienie porannej rutyny. Krótka sesja przed pracą i zaczynam dzień dużo spokojniej.",
    date: "Kwiecień 2026",
    rating: 5,
  },
  {
    name: "Bartosz M.",
    location: "Olsztyn",
    text: "Dobry produkt, chociaż liczyłem na trochę dłuższy czas pracy na baterii. Poza tym nie mam zastrzeżeń.",
    date: "Maj 2026",
    rating: 4,
  },
  {
    name: "Izabela R.",
    location: "Zielona Góra",
    text: "Migrena i napięcie karku dawały mi się we znaki po całym dniu przy biurku. Wieczorna sesja z GoodStim zauważalnie mi pomaga się rozluźnić.",
    date: "Czerwiec 2026",
    rating: 5,
  },
  {
    name: "Dariusz C.",
    location: "Opole",
    text: "Zamówienie przyszło szybko, urządzenie działa dokładnie tak jak opisane. Korzystam codziennie wieczorem od dwóch miesięcy.",
    date: "Lipiec 2026",
    rating: 5,
  },
];

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function computeAggregate(ratings: number[]): { score: number; count: number } {
  if (ratings.length === 0) return { score: 0, count: 0 };
  const sum = ratings.reduce((a, b) => a + b, 0);
  return { score: Math.round((sum / ratings.length) * 10) / 10, count: ratings.length };
}

export const AGGREGATE_RATING = computeAggregate(REVIEWS.map((r) => r.rating));
