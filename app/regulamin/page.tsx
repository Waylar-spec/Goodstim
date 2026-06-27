import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin sklepu – GoodStim",
  description: "Regulamin sklepu internetowego GoodStim",
};

export default function RegulamínPage() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="bg-tech-blue py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</Link>
          <Link href="/shop" className="text-on-primary-container hover:text-white text-sm font-semibold transition-colors">← Sklep</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-2">Regulamin sklepu</h1>
        <p className="text-sm text-on-surface-variant mb-12">Obowiązuje od: 1 lipca 2026 r.</p>

        <div className="prose prose-slate max-w-none space-y-10 text-on-surface leading-relaxed">

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 1. Postanowienia ogólne</h2>
            <p>Sklep internetowy dostępny pod adresem <strong>goodstim.pl</strong> prowadzony jest przez osobę fizyczną prowadzącą działalność gospodarczą:</p>
            <ul className="mt-3 space-y-1 list-none pl-0">
              <li><strong>Firma:</strong> [Nazwa JDG]</li>
              <li><strong>NIP:</strong> [NIP]</li>
              <li><strong>Adres:</strong> [Adres]</li>
              <li><strong>E-mail:</strong> kontakt@goodstim.pl</li>
            </ul>
            <p className="mt-3">Niniejszy Regulamin określa zasady korzystania ze Sklepu, składania zamówień, realizacji dostaw oraz prawa Klienta, w tym prawo do odstąpienia od umowy.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 2. Definicje</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Sklep</strong> – sklep internetowy prowadzony pod adresem goodstim.pl.</li>
              <li><strong>Klient</strong> – osoba fizyczna, prawna lub jednostka organizacyjna składająca zamówienie w Sklepie.</li>
              <li><strong>Konsument</strong> – Klient będący osobą fizyczną dokonującą zakupu niezwiązanego bezpośrednio z działalnością gospodarczą.</li>
              <li><strong>Produkt</strong> – urządzenie GoodStim VNS dostępne w ofercie Sklepu.</li>
              <li><strong>Umowa</strong> – umowa sprzedaży Produktu zawierana za pośrednictwem Sklepu.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 3. Składanie zamówień</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Zamówienia przyjmowane są przez całą dobę, 7 dni w tygodniu.</li>
              <li>Złożenie zamówienia następuje przez wypełnienie formularza na stronie Sklepu i dokonanie płatności.</li>
              <li>Po złożeniu zamówienia Klient otrzymuje potwierdzenie na podany adres e-mail.</li>
              <li>Umowę uważa się za zawartą z chwilą potwierdzenia przyjęcia zamówienia do realizacji przez Sprzedawcę.</li>
              <li>Ceny podane w Sklepie są cenami brutto (zawierają podatek VAT) i wyrażone są w złotych polskich (PLN).</li>
            </ol>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 4. Płatności</h2>
            <p>Sklep akceptuje następujące formy płatności:</p>
            <ul className="mt-3 space-y-1 list-disc pl-5">
              <li>Karta płatnicza (Visa, Mastercard) — obsługiwana przez Stripe</li>
              <li>BLIK — obsługiwany przez Stripe</li>
            </ul>
            <p className="mt-3">Płatności obsługiwane są przez Stripe Payments Europe, Ltd. Dane karty płatniczej nie są przechowywane przez Sprzedawcę.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 5. Dostawa</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Dostawa realizowana jest na terenie Polski.</li>
              <li>Zamówienia wysyłane są w ciągu 1–2 dni roboczych od potwierdzenia płatności.</li>
              <li>Dostawa jest bezpłatna.</li>
              <li>Dostępne metody dostawy: Kurier DPD oraz InPost Paczkomat.</li>
              <li>Czas dostawy: 1–2 dni robocze od nadania przesyłki.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 6. Prawo do odstąpienia od umowy</h2>
            <p>Zgodnie z art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie <strong>14 dni</strong> bez podawania przyczyny.</p>
            <p className="mt-3">Bieg terminu rozpoczyna się od dnia dostarczenia Produktu. Oświadczenie o odstąpieniu należy złożyć na adres e-mail: <strong>kontakt@goodstim.pl</strong> lub pisemnie na adres siedziby.</p>
            <p className="mt-3">Produkt należy odesłać nie później niż 14 dni od dnia złożenia oświadczenia o odstąpieniu. Koszty zwrotu ponosi Konsument, chyba że Sprzedawca wyraził zgodę na ich pokrycie.</p>
            <p className="mt-3">Zwrot środków nastąpi niezwłocznie, nie później niż w terminie 14 dni od dnia otrzymania oświadczenia o odstąpieniu, na rachunek bankowy Konsumenta.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 7. Reklamacje i gwarancja</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>Sprzedawca odpowiada za wady Produktu na zasadach określonych w przepisach o rękojmi (Kodeks cywilny).</li>
              <li>Reklamację można złożyć mailem na adres kontakt@goodstim.pl lub pisemnie.</li>
              <li>Reklamacja powinna zawierać: opis wady, datę jej stwierdzenia, dane Klienta oraz żądanie.</li>
              <li>Sprzedawca rozpatruje reklamację w terminie 14 dni roboczych.</li>
              <li>Dodatkowo Sprzedawca oferuje <strong>30-dniową Gwarancję Satysfakcji</strong>: jeśli Klient nie zauważy poprawy jakości snu lub samopoczucia, może zwrócić produkt w ciągu 30 dni i otrzymać pełny zwrot pieniędzy.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 8. Produkty — ważne zastrzeżenia</h2>
            <p>Urządzenia GoodStim są urządzeniami do użytku osobistego wspierającymi relaksację i redukcję stresu. <strong>Nie są wyrobami medycznymi</strong> w rozumieniu ustawy z dnia 7 kwietnia 2022 r. o wyrobach medycznych.</p>
            <p className="mt-3">Urządzenia nie służą do diagnozowania, leczenia ani zapobiegania chorobom. Przed użyciem należy zapoznać się z instrukcją obsługi. Osoby z rozrusznikiem serca, padaczką lub w ciąży powinny skonsultować się z lekarzem przed użyciem.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 9. Ochrona danych osobowych</h2>
            <p>Zasady przetwarzania danych osobowych opisane są w <Link href="/polityka-prywatnosci" className="text-vibrant-teal underline">Polityce prywatności</Link>.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 10. Postanowienia końcowe</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego.</li>
              <li>Sprzedawca zastrzega prawo do zmiany Regulaminu. Zmiany wchodzą w życie po 14 dniach od ich ogłoszenia.</li>
              <li>Spory rozstrzygane będą przez sąd właściwy dla siedziby Sprzedawcy, z zastrzeżeniem praw Konsumenta.</li>
              <li>Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń (platforma ODR: <a href="https://ec.europa.eu/consumers/odr" className="text-vibrant-teal underline" target="_blank" rel="noreferrer">ec.europa.eu/consumers/odr</a>).</li>
            </ol>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex gap-6 text-sm">
          <Link href="/polityka-prywatnosci" className="text-vibrant-teal hover:underline">Polityka prywatności →</Link>
          <Link href="/shop" className="text-on-surface-variant hover:text-primary">← Wróć do sklepu</Link>
        </div>
      </main>
    </div>
  );
}
