import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka prywatności – GoodStim",
  description: "Polityka prywatności sklepu internetowego GoodStim",
};

export default function PolitykaPrywatnosci() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="bg-tech-blue py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</Link>
          <Link href="/shop" className="text-on-primary-container hover:text-white text-sm font-semibold transition-colors">← Sklep</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-2">Polityka prywatności</h1>
        <p className="text-sm text-on-surface-variant mb-12">Obowiązuje od: 1 lipca 2026 r.</p>

        <div className="space-y-10 text-on-surface leading-relaxed">

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">1. Administrator danych osobowych</h2>
            <p>Administratorem Twoich danych osobowych jest:</p>
            <ul className="mt-3 space-y-1 list-none pl-0">
              <li><strong>Firma:</strong> Wojciech Dymek diagnostyka i leczenie bólu</li>
              <li><strong>NIP:</strong> 7182160692</li>
              <li><strong>Adres:</strong> ul. Wyszyńskiego 2/5, 18-400 Łomża</li>
              <li><strong>E-mail:</strong> kontakt@goodstim.pl</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">2. Jakie dane zbieramy i w jakim celu</h2>
            <div className="space-y-4">
              <div className="p-4 bg-soft-mint rounded-xl">
                <p className="font-semibold text-primary text-sm mb-1">Realizacja zamówienia</p>
                <p className="text-sm">Dane: imię, nazwisko, e-mail, adres dostawy, numer telefonu (InPost).<br/>
                Podstawa: art. 6 ust. 1 lit. b RODO (wykonanie umowy). Okres przechowywania: 5 lat (obowiązki podatkowe).</p>
              </div>
              <div className="p-4 bg-soft-mint rounded-xl">
                <p className="font-semibold text-primary text-sm mb-1">Newsletter (za zgodą)</p>
                <p className="text-sm">Dane: adres e-mail.<br/>
                Podstawa: art. 6 ust. 1 lit. a RODO (zgoda). Okres: do cofnięcia zgody. Zgodę możesz wycofać w dowolnym momencie.</p>
              </div>
              <div className="p-4 bg-soft-mint rounded-xl">
                <p className="font-semibold text-primary text-sm mb-1">Obowiązki prawne</p>
                <p className="text-sm">Dane: dane z faktur, historii zamówień.<br/>
                Podstawa: art. 6 ust. 1 lit. c RODO (obowiązek prawny). Okres: 5 lat od końca roku podatkowego.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">3. Odbiorcy danych</h2>
            <p>Twoje dane mogą być przekazywane:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
              <li><strong>Stripe Payments Europe, Ltd.</strong> — obsługa płatności. Siedziba: Dublin, Irlandia. Podstawa transferu: standardowe klauzule umowne UE.</li>
              <li><strong>InPost S.A.</strong> — dostawa przez paczkomaty. Siedziba: Kraków, Polska.</li>
              <li><strong>DPD Polska Sp. z o.o.</strong> — dostawa kurierska. Siedziba: Warszawa, Polska.</li>
              <li><strong>Resend Inc.</strong> — wysyłka e-maili transakcyjnych. Siedziba: USA. Podstawa transferu: standardowe klauzule umowne UE.</li>
              <li><strong>Neon Inc.</strong> — baza danych (Neon Database). Siedziba: USA. Podstawa transferu: standardowe klauzule umowne UE.</li>
            </ul>
            <p className="mt-4 text-sm">Nie sprzedajemy Twoich danych osobowych podmiotom trzecim.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">4. Twoje prawa</h2>
            <p className="mb-3 text-sm">Na podstawie RODO przysługują Ci:</p>
            <ul className="space-y-2 list-disc pl-5 text-sm">
              <li><strong>Prawo dostępu</strong> do swoich danych (art. 15 RODO)</li>
              <li><strong>Prawo do sprostowania</strong> nieprawidłowych danych (art. 16 RODO)</li>
              <li><strong>Prawo do usunięcia</strong> danych („prawo do bycia zapomnianym", art. 17 RODO)</li>
              <li><strong>Prawo do ograniczenia przetwarzania</strong> (art. 18 RODO)</li>
              <li><strong>Prawo do przenoszenia danych</strong> (art. 20 RODO)</li>
              <li><strong>Prawo sprzeciwu</strong> wobec przetwarzania (art. 21 RODO)</li>
              <li><strong>Prawo do cofnięcia zgody</strong> w każdym czasie (bez wpływu na zgodność z prawem przetwarzania przed cofnięciem)</li>
            </ul>
            <p className="mt-4 text-sm">Aby skorzystać z powyższych praw, skontaktuj się pod adresem: <strong>kontakt@goodstim.pl</strong></p>
            <p className="mt-3 text-sm">Przysługuje Ci prawo wniesienia skargi do <strong>Prezesa Urzędu Ochrony Danych Osobowych</strong> (ul. Stawki 2, 00-193 Warszawa).</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">5. Pliki cookies</h2>
            <p className="text-sm">Sklep korzysta z plików cookies niezbędnych do jego funkcjonowania (sesja koszyka, bezpieczeństwo). Pliki cookies analitycznych lub marketingowych używamy wyłącznie po uzyskaniu Twojej zgody za pomocą baneru cookie.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">6. Bezpieczeństwo danych</h2>
            <p className="text-sm">Stosujemy odpowiednie środki techniczne i organizacyjne chroniące dane przed nieuprawnionym dostępem, utratą lub zniszczeniem. Transmisja danych odbywa się z użyciem protokołu TLS/SSL. Dane kart płatniczych przetwarzane są wyłącznie przez Stripe — nie mamy do nich dostępu.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">7. Zmiany polityki prywatności</h2>
            <p className="text-sm">Zastrzegamy prawo do zmiany niniejszej Polityki. O istotnych zmianach poinformujemy e-mailem lub komunikatem na stronie. Aktualna wersja dostępna jest zawsze pod adresem goodstim.pl/polityka-prywatnosci.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex gap-6 text-sm">
          <Link href="/regulamin" className="text-vibrant-teal hover:underline">Regulamin sklepu →</Link>
          <Link href="/shop" className="text-on-surface-variant hover:text-primary">← Wróć do sklepu</Link>
        </div>
      </main>
    </div>
  );
}
