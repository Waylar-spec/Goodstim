import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin Programu Partnerskiego – GoodStim",
  description: "Regulamin programu partnerskiego (afiliacyjnego) GoodStim",
};

export default function AffiliateRegulaminPage() {
  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="bg-tech-blue py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-montserrat text-2xl font-extrabold uppercase tracking-widest text-vibrant-teal">GoodStim</Link>
          <Link href="/affiliate" className="text-on-primary-container hover:text-white text-sm font-semibold transition-colors">← Program Partnerski</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-montserrat text-4xl font-bold text-primary mb-2">Regulamin Programu Partnerskiego</h1>
        <p className="text-sm text-on-surface-variant mb-12">Obowiązuje od: 3 lipca 2026 r.</p>

        <div className="prose prose-slate max-w-none space-y-10 text-on-surface leading-relaxed">

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 1. Postanowienia ogólne</h2>
            <p>Organizatorem Programu Partnerskiego GoodStim (dalej: „Program") jest osoba fizyczna prowadząca działalność gospodarczą:</p>
            <ul className="mt-3 space-y-1 list-none pl-0">
              <li><strong>Firma:</strong> Wojciech Dymek diagnostyka i leczenie bólu</li>
              <li><strong>NIP:</strong> 7182160692</li>
              <li><strong>Adres:</strong> ul. Wyszyńskiego 2/5, 18-400 Łomża</li>
              <li><strong>E-mail:</strong> kontakt@goodstim.pl</li>
            </ul>
            <p className="mt-3">Program umożliwia osobom fizycznym i podmiotom gospodarczym (dalej: „Partner") promowanie produktów marki GoodStim w zamian za prowizję od wygenerowanej sprzedaży.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 2. Warunki uczestnictwa</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Uczestnikiem Programu może zostać osoba pełnoletnia, która wypełni formularz rejestracyjny i zaakceptuje niniejszy Regulamin.</li>
              <li>Rejestracja jest bezpłatna i nie wymaga prowadzenia działalności gospodarczej.</li>
              <li>Organizator zastrzega sobie prawo odmowy rejestracji lub usunięcia konta Partnera, którego działania naruszają niniejszy Regulamin lub dobre imię marki GoodStim.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 3. Zasady wynagradzania</h2>
            <p>Partner otrzymuje prowizję od każdej sprzedaży zrealizowanej za pośrednictwem jego unikalnego linku polecającego lub kodu rabatowego, zgodnie z poniższymi poziomami:</p>
            <ul className="mt-3 space-y-1 list-disc pl-5">
              <li><strong>Start</strong> — 10% (od pierwszej sprzedaży)</li>
              <li><strong>Silver</strong> — 15% (od 5. sprzedanej sztuki)</li>
              <li><strong>Gold</strong> — 20% (od 12. sprzedanej sztuki)</li>
              <li><strong>Diamond</strong> — 25% (od 25. sprzedanej sztuki)</li>
            </ul>
            <p className="mt-3">Poziom liczony jest ze skumulowanej liczby sprzedanych sztuk od początku uczestnictwa w Programie i rośnie wyłącznie w górę — nie ulega obniżeniu wskutek okresowego spadku aktywności.</p>
            <p className="mt-3">Kod Partnera może jednocześnie funkcjonować jako kod rabatowy uprawniający klienta do zniżki w wysokości 10% od ceny katalogowej. Prowizja naliczana jest od kwoty faktycznie zapłaconej przez klienta (po uwzględnieniu rabatu).</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 4. Śledzenie i atrybucja</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Kliknięcie w link polecający Partnera zapisuje w przeglądarce klienta plik cookie ważny przez 30 dni.</li>
              <li>Sprzedaż jest przypisywana Partnerowi na zasadzie <strong>ostatniego kliknięcia (last-click)</strong> — jeśli klient skorzystał z linków więcej niż jednego Partnera, prowizja należy się temu, którego link został kliknięty jako ostatni przed zakupem.</li>
              <li>Wpisanie kodu rabatowego Partnera bezpośrednio w koszyku przypisuje sprzedaż temu Partnerowi niezależnie od wcześniejszej historii kliknięć.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 5. Wypłaty</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Naliczona prowizja widoczna jest na bieżąco w panelu Partnera.</li>
              <li>Wypłata możliwa jest po osiągnięciu progu <strong>150 zł</strong> zebranej prowizji.</li>
              <li>Wypłata realizowana jest przelewem bankowym na konto wskazane przez Partnera w panelu, w terminie do 14 dni roboczych od zgłoszenia.</li>
              <li>Partner odpowiada samodzielnie za rozliczenie podatkowe otrzymanych środków zgodnie z obowiązującymi przepisami prawa.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 6. Działania zabronione</h2>
            <p>W ramach uczestnictwa w Programie Partnerowi zabrania się:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Licytowania słów kluczowych z nazwą marki</strong> — Partner nie może kupować reklam w wyszukiwarkach (np. Google Ads) opartych o frazę „GoodStim", jej warianty, błędne zapisy lub pochodne.</li>
              <li><strong>Wprowadzających w błąd fraz reklamowych</strong> — w tym kombinacji typu „GoodStim + kod rabatowy", „GoodStim + promocja" sugerujących oficjalne partnerstwo w sposób niezgodny ze stanem faktycznym.</li>
              <li><strong>Rejestrowania domen z nazwą marki</strong> — Partner nie może rejestrować domen, subdomen ani adresów URL zawierających „GoodStim" lub jego warianty.</li>
              <li><strong>Formułowania twierdzeń medycznych</strong> — GoodStim VNS One jest produktem wellness, nie wyrobem medycznym. Partner nie może sugerować, że produkt leczy, diagnozuje lub zapobiega jakimkolwiek chorobom.</li>
              <li><strong>Spamu i działań wprowadzających w błąd</strong> — w tym fałszywych opinii, sztucznego generowania kliknięć oraz nierzetelnych informacji o produkcie.</li>
            </ul>
            <p className="mt-3">Naruszenie powyższych zasad może skutkować natychmiastowym usunięciem Partnera z Programu oraz utratą prawa do niewypłaconej prowizji.</p>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 7. Czas trwania i rezygnacja</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Partner może w każdej chwili zrezygnować z uczestnictwa w Programie, kontaktując się z Organizatorem.</li>
              <li>Konta bez żadnej zarejestrowanej sprzedaży mogą zostać usunięte przez Organizatora w ramach porządkowania Programu.</li>
              <li>Konta z historią sprzedaży nie są usuwane — mogą zostać jedynie dezaktywowane, z zachowaniem prawa do już naliczonej prowizji.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-montserrat text-xl font-semibold text-primary mb-3">§ 8. Postanowienia końcowe</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>Organizator zastrzega sobie prawo do zmiany niniejszego Regulaminu. O zmianach Partnerzy zostaną poinformowani drogą mailową z minimum 7-dniowym wyprzedzeniem.</li>
              <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego.</li>
              <li>Pytania dotyczące Programu można kierować na adres: <a href="mailto:kontakt@goodstim.pl" className="text-secondary font-semibold">kontakt@goodstim.pl</a>.</li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
