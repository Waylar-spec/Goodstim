export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Sen" | "Stres" | "Nauka" | "Regeneracja" | "Poradnik";
  readMin: number;
  date: string; // ISO
  cover: string; // emoji fallback
  image?: string; // Unsplash photo URL
  metaDescription: string;
  keywords: string[];
  content: string; // HTML
};

// Wspólny disclaimer dołączany do każdego wpisu — GoodStim NIE jest wyrobem medycznym.
const DISCLAIMER = `
<div class="not-prose my-10 p-5 rounded-2xl bg-soft-mint border border-vibrant-teal/20 text-sm text-on-surface-variant">
  <strong class="text-primary">Ważne:</strong> GoodStim to urządzenie wspierające relaks i dobre samopoczucie do użytku osobistego.
  Nie jest wyrobem medycznym i nie służy do diagnozowania, leczenia ani zapobiegania chorobom.
  W przypadku problemów zdrowotnych skonsultuj się z lekarzem.
</div>`;

export const POSTS: BlogPost[] = [
  {
    slug: "czym-jest-nerw-bledny",
    title: "Czym jest nerw błędny i dlaczego warto o niego dbać?",
    excerpt: "Nerw błędny to główna „autostrada\" Twojego układu nerwowego. Poznaj, jak wpływa na spokój, sen i energię — i jak możesz go wspierać każdego dnia.",
    category: "Nauka",
    readMin: 6,
    date: "2026-06-02",
    cover: "🧠",
    metaDescription: "Nerw błędny (vagus) — co to jest, jak działa i jak wspierać go na co dzień. Poznaj rolę nerwu błędnego w redukcji stresu, lepszym śnie i regeneracji.",
    keywords: ["nerw błędny", "co to jest nerw błędny", "vagus nerve", "stymulacja nerwu błędnego", "układ nerwowy"],
    content: `
<p>Nerw błędny (łac. <em>nervus vagus</em>) to najdłuższy nerw czaszkowy w ludzkim ciele. Biegnie od pnia mózgu, przez szyję, aż do narządów wewnętrznych — serca, płuc i układu pokarmowego. To kluczowy element <strong>układu przywspółczulnego</strong>, czyli tej części układu nerwowego, która odpowiada za stan „odpoczynku i regeneracji".</p>

<h2>Dlaczego nerw błędny jest tak ważny?</h2>
<p>Kiedy jesteś zestresowany, dominuje układ współczulny — tryb „walcz albo uciekaj". Nerw błędny działa odwrotnie: pomaga organizmowi wrócić do równowagi, spowolnić tętno i się wyciszyć. Im sprawniej działa, tym łatwiej radzisz sobie z napięciem.</p>

<h2>Co to jest „napięcie nerwu błędnego"?</h2>
<p>Naukowcy używają pojęcia <strong>tonusu (napięcia) nerwu błędnego</strong>, by opisać jak aktywny jest ten nerw. Wyższy tonus często idzie w parze z lepszą <strong>zmiennością rytmu serca (HRV)</strong> — wskaźnikiem, który wielu sportowców i osób dbających o zdrowie monitoruje na co dzień.</p>

<h2>Jak wspierać nerw błędny?</h2>
<ul>
  <li><strong>Powolny oddech</strong> — wydłużanie wydechu aktywuje reakcję wyciszenia.</li>
  <li><strong>Zimno</strong> — chłodny prysznic czy zimna woda na twarz.</li>
  <li><strong>Nucenie i śpiew</strong> — wibracje stymulują okolice gardła.</li>
  <li><strong>Stymulacja tVNS</strong> — łagodne impulsy przez skórę ucha, gdzie biegnie gałąź nerwu błędnego.</li>
</ul>

<p>Urządzenia takie jak <strong>GoodStim</strong> wykorzystują tę ostatnią metodę — przezskórną stymulację nerwu błędnego (tVNS). Łagodne impulsy w okolicy małżowiny usznej to wygodny sposób, by włączyć codzienną chwilę relaksu w swoją rutynę.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "tvns-a-redukcja-stresu",
    title: "Jak stymulacja nerwu błędnego (tVNS) może wspierać redukcję stresu",
    excerpt: "Stres towarzyszy nam codziennie. Sprawdź, jak przezskórna stymulacja nerwu błędnego pomaga wielu osobom odzyskać spokój w 15 minut dziennie.",
    category: "Stres",
    readMin: 5,
    date: "2026-06-05",
    cover: "🌿",
    metaDescription: "Jak tVNS wspiera redukcję stresu? Poznaj mechanizm stymulacji nerwu błędnego i dlaczego 15 minut dziennie może pomóc Ci się wyciszyć.",
    keywords: ["redukcja stresu", "tVNS stres", "stymulacja nerwu błędnego stres", "jak się zrelaksować", "naturalne metody na stres"],
    content: `
<p>Przewlekły stres to jeden z największych wyzwań współczesnego życia. Napięte mięśnie, gonitwa myśli, problemy z zaśnięciem — to sygnały, że Twój układ nerwowy zbyt długo pozostaje w trybie „walcz albo uciekaj".</p>

<h2>Rola nerwu błędnego w wyciszaniu</h2>
<p>Nerw błędny to naturalny „hamulec" organizmu. To on pomaga przejść ze stanu pobudzenia do stanu spokoju. Problem w tym, że w ciągłym napięciu ten mechanizm bywa „przygłuszony".</p>

<h2>Jak działa tVNS?</h2>
<p>Przezskórna stymulacja nerwu błędnego (tVNS) polega na dostarczaniu delikatnych impulsów elektrycznych do gałęzi nerwu błędnego, która dochodzi do skóry ucha. To nieinwazyjna, wygodna metoda, którą można stosować w domu.</p>

<p>Użytkownicy GoodStim często opisują efekt jako <strong>„poczucie wyciszenia"</strong> i łatwiejsze „przełączenie się" po stresującym dniu. Badania nad tVNS sugerują wpływ na układ przywspółczulny, choć efekty są indywidualne.</p>

<h2>Prosta rutyna antystresowa</h2>
<ol>
  <li>Znajdź spokojne miejsce i wygodną pozycję.</li>
  <li>Załóż elektrodę GoodStim na ucho.</li>
  <li>Włącz wybrany tryb na 15 minut.</li>
  <li>Połącz sesję z powolnym oddechem — wdech na 4, wydech na 6.</li>
</ol>

<p>Regularność jest kluczem. Wiele osób włącza tVNS w wieczorny rytuał — podobnie jak medytację czy ciepłą herbatę.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "7-sposobow-na-pobudzenie-nerwu-blednego",
    title: "7 naturalnych sposobów na pobudzenie nerwu błędnego",
    excerpt: "Od oddechu po zimną wodę — poznaj 7 prostych metod, które mogą wspierać aktywność nerwu błędnego. Plus jedno nowoczesne narzędzie.",
    category: "Poradnik",
    readMin: 7,
    date: "2026-06-08",
    cover: "❄️",
    metaDescription: "7 sprawdzonych, naturalnych sposobów na pobudzenie nerwu błędnego: oddech, zimno, nucenie, medytacja i tVNS. Praktyczny poradnik krok po kroku.",
    keywords: ["pobudzenie nerwu błędnego", "jak stymulować nerw błędny", "naturalne metody", "techniki oddechowe", "zimne prysznice"],
    content: `
<p>Nie musisz od razu sięgać po technologię, by zadbać o swój nerw błędny. Oto siedem metod, które możesz wpleść w codzienność — a na końcu jedno narzędzie, które robi to za Ciebie.</p>

<h2>1. Powolny, przeponowy oddech</h2>
<p>Wydłużony wydech to najprostszy „włącznik" reakcji wyciszenia. Spróbuj oddychać 6 razy na minutę przez kilka minut.</p>

<h2>2. Ekspozycja na zimno</h2>
<p>Zimny prysznic lub chłodna woda na twarz mogą aktywować odruch nurkowania, w którym uczestniczy nerw błędny.</p>

<h2>3. Nucenie, śpiew i mantry</h2>
<p>Struny głosowe są połączone z nerwem błędnym. Nucenie ulubionej melodii to przyjemny sposób na delikatną stymulację.</p>

<h2>4. Medytacja i uważność</h2>
<p>Regularna praktyka uważności sprzyja równowadze układu nerwowego.</p>

<h2>5. Aktywność fizyczna</h2>
<p>Umiarkowany ruch — spacer, joga, pływanie — wspiera ogólną kondycję autonomicznego układu nerwowego.</p>

<h2>6. Kontakt społeczny i śmiech</h2>
<p>Szczery śmiech i bliskie relacje to niedoceniane „paliwo" dla dobrostanu.</p>

<h2>7. Przezskórna stymulacja (tVNS)</h2>
<p>To najbardziej ukierunkowana z metod. Urządzenie <strong>GoodStim</strong> dostarcza łagodne impulsy bezpośrednio do gałęzi nerwu błędnego w uchu — w wygodnych, 15-minutowych sesjach.</p>

<p>Najlepsze efekty? Połącz tVNS z oddechem i wieczorną rutyną. Naturalne metody i technologia świetnie się uzupełniają.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "lepszy-sen-z-tvns",
    title: "Lepszy sen dzięki wieczornej rutynie z tVNS",
    excerpt: "Problemy z zaśnięciem i gonitwa myśli wieczorem? Zobacz, jak zbudować rutynę relaksu, która pomaga wyciszyć układ nerwowy przed snem.",
    category: "Sen",
    readMin: 6,
    date: "2026-06-11",
    cover: "🌙",
    metaDescription: "Jak poprawić jakość snu dzięki tVNS i wieczornej rutynie. Praktyczne wskazówki na wyciszenie układu nerwowego i spokojniejsze zasypianie.",
    keywords: ["lepszy sen", "tVNS sen", "problemy z zasypianiem", "wieczorna rutyna", "jak zasnąć", "higiena snu"],
    content: `
<p>Dobry sen zaczyna się na długo przed położeniem się do łóżka. Jeśli wieczorem Twój umysł wciąż „pędzi", to znak, że układ nerwowy nie zdążył przełączyć się w tryb regeneracji.</p>

<h2>Dlaczego trudno „wyłączyć głowę"?</h2>
<p>Po dniu pełnym bodźców — ekranów, powiadomień, stresu — organizm pozostaje w stanie pobudzenia. Nerw błędny pomaga zainicjować stan wyciszenia niezbędny do zaśnięcia.</p>

<h2>Wieczorna rutyna krok po kroku</h2>
<ol>
  <li><strong>60 minut przed snem:</strong> przyciemnij światło, odłóż telefon.</li>
  <li><strong>30 minut przed snem:</strong> 15-minutowa sesja GoodStim w trybie „Deep Relax".</li>
  <li><strong>Podczas sesji:</strong> oddychaj powoli, skup się na wydłużonym wydechu.</li>
  <li><strong>Po sesji:</strong> ciepła herbata ziołowa lub kilka stron książki.</li>
</ol>

<h2>Co zgłaszają użytkownicy?</h2>
<p>Wiele osób korzystających z GoodStim opisuje, że wieczorna sesja stała się dla nich sygnałem „koniec dnia" — momentem, który pomaga oddzielić obowiązki od odpoczynku. Efekty są indywidualne, ale regularność i spójna rutyna mają tu największe znaczenie.</p>

<h2>Wzmocnij efekt</h2>
<ul>
  <li>Stała pora snu — nawet w weekendy.</li>
  <li>Chłodna, ciemna sypialnia.</li>
  <li>Ograniczenie kofeiny po południu.</li>
</ul>
${DISCLAIMER}
`,
  },
  {
    slug: "hrv-co-to-jest",
    title: "HRV — co mówi o Twoim układzie nerwowym i jak je wspierać",
    excerpt: "Zmienność rytmu serca (HRV) to jeden z najlepszych wskaźników regeneracji. Dowiedz się, co oznacza i jak nad nim pracować.",
    category: "Nauka",
    readMin: 7,
    date: "2026-06-14",
    cover: "❤️",
    metaDescription: "Czym jest HRV (zmienność rytmu serca), dlaczego to ważny wskaźnik regeneracji i jak wspierać HRV poprzez oddech, sen i stymulację nerwu błędnego.",
    keywords: ["HRV", "zmienność rytmu serca", "co to jest HRV", "jak poprawić HRV", "regeneracja", "nerw błędny HRV"],
    content: `
<p>Jeśli nosisz smartwatch lub opaskę sportową, prawdopodobnie spotkałeś się ze skrótem <strong>HRV</strong>. To jeden z najbardziej praktycznych wskaźników kondycji Twojego układu nerwowego.</p>

<h2>Czym jest HRV?</h2>
<p>HRV (ang. <em>Heart Rate Variability</em>) to zmienność odstępów czasu między kolejnymi uderzeniami serca. Wbrew intuicji — <strong>większa zmienność jest zwykle lepsza</strong>. Oznacza, że organizm elastycznie reaguje na zmieniające się warunki.</p>

<h2>HRV a nerw błędny</h2>
<p>HRV jest ściśle powiązane z aktywnością nerwu błędnego. Wyższy tonus nerwu błędnego często idzie w parze z wyższym HRV — dlatego metody wspierające nerw błędny bywają wiązane z lepszą regeneracją.</p>

<h2>Co obniża HRV?</h2>
<ul>
  <li>Przewlekły stres i niewyspanie.</li>
  <li>Nadmiar alkoholu i kofeiny.</li>
  <li>Przetrenowanie bez regeneracji.</li>
</ul>

<h2>Jak wspierać HRV?</h2>
<ul>
  <li><strong>Sen</strong> — to fundament regeneracji.</li>
  <li><strong>Oddech</strong> — ćwiczenia oddechowe wpływają na układ przywspółczulny.</li>
  <li><strong>tVNS</strong> — stymulacja nerwu błędnego jako element rutyny relaksu.</li>
</ul>

<p>GoodStim wpisuje się w trend świadomego dbania o regenerację. Połączenie monitoringu HRV z codzienną rutyną wyciszenia to podejście, które docenia coraz więcej osób aktywnych.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "tvns-dla-sportowcow",
    title: "tVNS dla sportowców: regeneracja i reset układu nerwowego",
    excerpt: "Trening to tylko połowa sukcesu. Druga połowa to regeneracja. Sprawdź, jak osoby aktywne włączają tVNS w swoją rutynę odnowy.",
    category: "Regeneracja",
    readMin: 6,
    date: "2026-06-17",
    cover: "🏃",
    metaDescription: "Jak sportowcy wykorzystują tVNS do regeneracji i resetu układu nerwowego. Rola nerwu błędnego i HRV w odnowie po treningu.",
    keywords: ["regeneracja sportowca", "tVNS sport", "regeneracja po treningu", "HRV sport", "reset układu nerwowego", "odnowa biologiczna"],
    content: `
<p>Każdy doświadczony sportowiec wie: postęp nie dzieje się podczas treningu, ale podczas regeneracji. Im szybciej organizm wraca do równowagi, tym lepiej znosi kolejne obciążenia.</p>

<h2>Układ nerwowy a regeneracja</h2>
<p>Intensywny wysiłek aktywuje układ współczulny. Aby się zregenerować, organizm musi „przełączyć się" na układ przywspółczulny — i tu kluczową rolę odgrywa nerw błędny.</p>

<h2>Po co sportowcom tVNS?</h2>
<p>Coraz więcej osób aktywnych — od biegaczy po triathlonistów — eksperymentuje z przezskórną stymulacją nerwu błędnego jako elementem odnowy. Cel? Wspomóc „reset" układu nerwowego po ciężkim dniu treningowym.</p>

<h2>Przykładowa rutyna regeneracyjna</h2>
<ol>
  <li>Po treningu: rozciąganie i nawodnienie.</li>
  <li>Wieczorem: 15-minutowa sesja GoodStim w trybie relaksacyjnym.</li>
  <li>Monitoring: obserwuj HRV rano, by ocenić gotowość organizmu.</li>
</ol>

<h2>Spójność ponad wszystko</h2>
<p>Tak jak w treningu, również w regeneracji liczy się systematyczność. tVNS nie zastąpi snu ani odżywiania — to dodatkowe narzędzie w arsenale świadomego sportowca.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "spokoj-po-pracy",
    title: "Stres a układ przywspółczulny: jak znaleźć spokój po pracy",
    excerpt: "Trudno „zostawić pracę w pracy”? Poznaj prosty rytuał przejścia, który pomaga przełączyć się z trybu zadań w tryb odpoczynku.",
    category: "Stres",
    readMin: 5,
    date: "2026-06-20",
    cover: "🍵",
    metaDescription: "Jak przełączyć się z trybu pracy w tryb odpoczynku. Rola układu przywspółczulnego i nerwu błędnego w wieczornym wyciszeniu po stresującym dniu.",
    keywords: ["spokój po pracy", "wypalenie", "jak się odstresować", "układ przywspółczulny", "work life balance", "relaks po pracy"],
    content: `
<p>Praca zdalna i wieczne „bycie online" zatarły granicę między obowiązkami a odpoczynkiem. Efekt? Wieczorem ciało jest w domu, ale głowa wciąż w pracy.</p>

<h2>Dlaczego trudno „wyłączyć się"?</h2>
<p>Po godzinach napięcia układ współczulny pozostaje aktywny. Bez świadomego „rytuału przejścia" organizm nie wie, że można już zwolnić.</p>

<h2>Stwórz swój rytuał przejścia</h2>
<p>Rytuał przejścia to seria prostych czynności, które sygnalizują mózgowi: „dzień pracy się skończył". Może to być:</p>
<ul>
  <li>Krótki spacer po skończonej pracy.</li>
  <li>Przebranie się w „domowe" ubrania.</li>
  <li>15-minutowa sesja GoodStim z filiżanką herbaty.</li>
</ul>

<h2>Dlaczego tVNS pasuje do tego momentu?</h2>
<p>Stymulacja nerwu błędnego wspiera aktywność układu przywspółczulnego — tej części układu nerwowego, która odpowiada za odpoczynek. Dla wielu użytkowników krótka sesja stała się czytelnym sygnałem „koniec trybu zadań".</p>

<p>Najważniejsze, by rytuał był powtarzalny. Z czasem sam mózg zacznie kojarzyć go z odpoczynkiem.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "tvns-vs-medytacja",
    title: "tVNS a medytacja: czy technologia może wspierać relaks?",
    excerpt: "Medytacja vs nowoczesna technologia — czy trzeba wybierać? Pokazujemy, jak tVNS i praktyki uważności mogą się uzupełniać.",
    category: "Nauka",
    readMin: 6,
    date: "2026-06-23",
    cover: "🧘",
    metaDescription: "tVNS czy medytacja? Porównanie i wskazówki, jak łączyć stymulację nerwu błędnego z praktyką uważności dla lepszego relaksu.",
    keywords: ["tVNS medytacja", "medytacja a technologia", "uważność", "mindfulness", "relaks", "techniki relaksacyjne"],
    content: `
<p>Medytacja jest praktykowana od tysięcy lat. tVNS to nowoczesna technologia. Czy te dwa światy mogą się spotkać? Naszym zdaniem nie tylko mogą — świetnie się uzupełniają.</p>

<h2>Co je łączy?</h2>
<p>Zarówno medytacja, jak i tVNS dążą do tego samego: wspierania równowagi układu nerwowego i aktywności przywspółczulnej. Różni je droga — jedna przez praktykę umysłu, druga przez łagodny impuls fizyczny.</p>

<h2>Dla kogo medytacja bywa trudna?</h2>
<p>Wiele osób na starcie ma problem z „wyłączeniem myśli". tVNS może być dla nich pomocnym wsparciem — fizyczny bodziec ułatwia skupienie na tu i teraz.</p>

<h2>Jak je połączyć?</h2>
<ol>
  <li>Załóż GoodStim i włącz 15-minutową sesję.</li>
  <li>W trakcie sesji prowadź prostą medytację oddechową.</li>
  <li>Skup uwagę na delikatnym odczuciu impulsu i rytmie oddechu.</li>
</ol>

<p>Efekt? Praktyka uważności zyskuje „kotwicę", a sesja tVNS — głębszy wymiar mentalny. To podejście, które docenią zarówno początkujący, jak i doświadczeni praktycy.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "jak-zaczac-z-goodstim",
    title: "Jak zacząć z GoodStim — przewodnik dla początkujących",
    excerpt: "Masz nowe urządzenie GoodStim? Ten przewodnik krok po kroku pomoże Ci zbudować skuteczną rutynę od pierwszego dnia.",
    category: "Poradnik",
    readMin: 5,
    date: "2026-06-25",
    cover: "🚀",
    metaDescription: "Przewodnik dla początkujących: jak zacząć korzystać z GoodStim. Pierwsza sesja tVNS, ustawienia, rutyna i najczęstsze pytania.",
    keywords: ["jak używać GoodStim", "pierwsza sesja tVNS", "instrukcja GoodStim", "przewodnik tVNS", "stymulator nerwu błędnego obsługa"],
    content: `
<p>Gratulacje — masz w rękach GoodStim! Aby w pełni wykorzystać potencjał urządzenia, warto zacząć od solidnych podstaw. Oto jak to zrobić.</p>

<h2>Krok 1: Przygotowanie</h2>
<p>Naładuj urządzenie i przygotuj żel przewodzący. Oczyść okolicę ucha — czysta, lekko wilgotna skóra zapewnia najlepsze przewodzenie.</p>

<h2>Krok 2: Pierwsza sesja</h2>
<p>Zacznij od najniższej intensywności. Powinieneś czuć delikatne mrowienie — nie ból. Stopniowo zwiększaj poziom do komfortowego, wyraźnego, ale przyjemnego odczucia.</p>

<h2>Krok 3: Wybór trybu</h2>
<p>GoodStim oferuje kilka trybów. Na początek polecamy tryb relaksacyjny wieczorem, gdy chcesz się wyciszyć.</p>

<h2>Krok 4: Budowanie rutyny</h2>
<p>Najlepsze efekty daje regularność. Wybierz stałą porę — np. 30 minut przed snem — i trzymaj się jej przez co najmniej 2-3 tygodnie.</p>

<h2>Najczęstsze pytania</h2>
<ul>
  <li><strong>Jak długo trwa sesja?</strong> Standardowo 15 minut.</li>
  <li><strong>Czy mogę używać codziennie?</strong> Tak, urządzenie jest przeznaczone do codziennego użytku.</li>
  <li><strong>Kiedy zobaczę efekty?</strong> To indywidualne — wiele osób zauważa różnicę w samopoczuciu po kilku tygodniach regularnych sesji.</li>
</ul>

<p>Pamiętaj: GoodStim to narzędzie wspierające relaks. Najlepiej działa jako część zdrowego stylu życia — obok dobrego snu, ruchu i zbilansowanej diety.</p>
${DISCLAIMER}
`,
  },
  {
    slug: "nerw-bledny-koncentracja-energia",
    title: "Nerw błędny a koncentracja i energia w ciągu dnia",
    excerpt: "Spadek energii po południu? Trudność ze skupieniem? Zobacz, jak równowaga układu nerwowego wpływa na Twoją produktywność.",
    category: "Stres",
    readMin: 5,
    date: "2026-06-27",
    cover: "⚡",
    metaDescription: "Jak nerw błędny i równowaga układu nerwowego wpływają na koncentrację i poziom energii. Praktyczne wskazówki na lepszą produktywność w ciągu dnia.",
    keywords: ["koncentracja", "energia w ciągu dnia", "produktywność", "spadek energii", "nerw błędny energia", "skupienie"],
    content: `
<p>Wbrew pozorom, więcej kawy nie zawsze oznacza więcej energii. Często to nie brak pobudzenia, a <strong>brak równowagi</strong> układu nerwowego stoi za popołudniowym spadkiem formy.</p>

<h2>Energia to kwestia równowagi</h2>
<p>Nasz organizm naturalnie balansuje między pobudzeniem (układ współczulny) a regeneracją (układ przywspółczulny). Kiedy zbyt długo „jedziemy na wysokich obrotach", przychodzi zmęczenie i rozkojarzenie.</p>

<h2>Rola nerwu błędnego</h2>
<p>Sprawny nerw błędny pomaga organizmowi szybciej się resetować — także w ciągu dnia. Krótkie momenty wyciszenia mogą pomóc „naładować baterie" lepiej niż kolejna kawa.</p>

<h2>Mikro-przerwy na regenerację</h2>
<ul>
  <li><strong>Oddech pudełkowy</strong> — 4 sekundy wdech, 4 zatrzymanie, 4 wydech, 4 zatrzymanie.</li>
  <li><strong>Krótka sesja tVNS</strong> — np. w przerwie obiadowej.</li>
  <li><strong>Spacer bez telefonu</strong> — 10 minut świeżego powietrza.</li>
</ul>

<h2>Wpleć GoodStim w dzień pracy</h2>
<p>Choć wielu użytkowników stosuje GoodStim wieczorem, krótka sesja w środku dnia może być dobrym „resetem" przed drugą połową obowiązków. Eksperymentuj i obserwuj, co działa dla Ciebie.</p>
${DISCLAIMER}
`,
  },
];

export const BLOG_IMAGES: Record<string, string> = {
  "czym-jest-nerw-bledny":
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&q=80&fit=crop",
  "tvns-a-redukcja-stresu":
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80&fit=crop",
  "7-sposobow-na-pobudzenie-nerwu-blednego":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80&fit=crop",
  "lepszy-sen-z-tvns":
    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80&fit=crop",
  "hrv-co-to-jest":
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80&fit=crop",
  "tvns-dla-sportowcow":
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80&fit=crop",
  "spokoj-po-pracy":
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&q=80&fit=crop",
  "tvns-vs-medytacja":
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&fit=crop",
  "jak-zaczac-z-goodstim":
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&fit=crop",
  "nerw-bledny-koncentracja-energia":
    "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200&q=80&fit=crop",
};

export const CATEGORIES = ["Wszystkie", "Sen", "Stres", "Nauka", "Regeneracja", "Poradnik"] as const;

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const getAllSlugs = () => POSTS.map((p) => p.slug);
export const getSortedPosts = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
export const getRelated = (slug: string, n = 3) =>
  getSortedPosts().filter((p) => p.slug !== slug).slice(0, n);
