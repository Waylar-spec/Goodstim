import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Icon from "../components/Icon";

export const metadata: Metadata = {
  title: "Jak działa stymulator nerwu błędnego? Nauka VNS",
  description:
    "Poznaj mechanizm działania stymulatora nerwu błędnego (tVNS). Badania kliniczne, anatomia nerwu błędnego, wpływ na HRV, stres i sen. Biała Księga Technologii GoodStim.",
  keywords: [
    "jak działa stymulator nerwu błędnego",
    "stymulacja nerwu błędnego nauka",
    "tVNS badania kliniczne",
    "nerw błędny VNS mechanizm",
    "stymulacja nerwu błędnego efekty",
    "HRV stymulacja nerwu błędnego",
  ],
  openGraph: {
    title: "Jak działa stymulator nerwu błędnego? Nauka VNS",
    description:
      "Poznaj mechanizm działania tVNS — od anatomii nerwu błędnego po badania kliniczne. Dowody naukowe, wpływ na stres i HRV.",
    type: "article",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jak działa stymulator nerwu błędnego? Nauka VNS",
    description:
      "Mechanizm tVNS, badania kliniczne, wpływ na HRV i stres — kompletna Biała Księga Technologii GoodStim.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Jak działa stymulator nerwu błędnego? Nauka za GoodStim",
  description:
    "Kompleksowy przegląd mechanizmów stymulacji nerwu błędnego (tVNS), dowodów klinicznych oraz wpływu na redukcję stresu, HRV i jakość snu.",
  publisher: { "@type": "Organization", name: "GoodStim" },
  keywords: "stymulator nerwu błędnego, tVNS, VNS, HRV, stymulacja nerwu błędnego",
};

const ANATOMY_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBoiq0tQ8jV_aiZHX5MRGmWLB_bQzpcFhJjOl2XTW5mqitKhEB3guouzwzEDpOm9zcmVy4hiWJCrHhkt4YVkdWIMr6pKgO_hIhsJS1OaQ5SCthoMM0amwiqWr3nNnLlR60OQV-w3MJlXbJJeQQFFSG_shgMmgAt9zLDY33AKr8H6fFT3MT9oid-FzsPtve0AHo42_3OJKYw-xnN16RW9K15Zr15DrIa3D25kEo69QN6Z6NXYQNKf-aZDUL_gQeA6L5ymNYgLBf-ZQ";
const SLEEP_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZo_-l9CHVfsDUw099QRjhxZJo59_sJELizcbS289WnTHwUG4PLYh_ox-G_Qeb4H_xsJla_9my_rBnn9Jw_jPE5ftauEycwZSc328H7SaKayTHWIq5N0wcwPWf3DODLOT-8HGPMeVAlwMsPDGab8RMHdX_KHb-LaadxTtoG8MFIbb2UY3H5y9bmpvei0bvGPc9wCnahnxavG_URxIuTFo-WonxrriyFLai1EK9IqgXSQIQqDf-K-PYaAs2xSsi_6uNiTbizxG4Ng";

const ANATOMY_LEFT = [
  { icon: "psychology", label: "Mózg", title: "Kontrola Stanu", desc: "Przekazuje sygnały do jądra pasma samotnego, modulując reakcje stresowe i nastrój." },
  { icon: "favorite", label: "Serce", title: "Zmienność HRV", desc: "Reguluje tętno, promując wysoką zmienność rytmu serca (HRV) – marker zdrowia i odporności." },
];

const ANATOMY_RIGHT = [
  { icon: "air", label: "Płuca", title: "Spokojny Oddech", desc: "Synchronizuje oddech z rytmem serca, ułatwiając głęboką relaksację i dotlenienie tkanek." },
  { icon: "nutrition", label: "Jelita", title: "Oś Jelita-Mózg", desc: "Wpływa na mikrobiom i procesy zapalne, redukując objawy \"stresowego brzucha\"." },
];

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-surface text-on-background font-sans selection:bg-vibrant-teal selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">

        {/* HERO */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-soft-mint text-secondary px-4 py-1 rounded-full text-sm font-semibold tracking-wide mb-6 inline-block">
                Biała Księga Technologii
              </span>
              <h1 className="font-montserrat text-[clamp(36px,5vw,48px)] leading-[1.16] font-bold tracking-[-0.02em] text-tech-blue mb-8">
                Nauka za GoodStim:{" "}
                <span className="text-secondary">Rewolucja VNS</span>
              </h1>
              <p className="text-lg leading-7 text-on-surface-variant max-w-xl">
                Zrozumienie mechanizmów stymulacji nerwu błędnego (VNS) pozwala przejąć kontrolę nad stanem fizjologicznym organizmu, redukując stres i optymalizując regenerację w czasie rzeczywistym.
              </p>
            </div>
            <div className="relative h-[500px] rounded-[24px] overflow-hidden shadow-2xl bg-tech-blue">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10 px-8">
                  <Icon name="neurology" className="text-6xl mb-4 text-vibrant-teal vns-pulse" />
                  <p className="font-montserrat text-2xl font-semibold">Bio-elektryczny Interfejs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANATOMY */}
        <section className="bg-surface-container-low py-32">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16">
            <div className="text-center mb-20">
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-tech-blue mb-4">
                Nerw Błędny: Magistrala Informacyjna
              </h2>
              <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
                Najdłuższy nerw czaszkowy w ciele, łączący mózg z sercem, płucami i układem pokarmowym. To on zarządza Twoim systemem &ldquo;odpoczynku i trawienia&rdquo;.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Left cards */}
              <div className="space-y-6">
                {ANATOMY_LEFT.map((c) => (
                  <div key={c.label} className="p-8 bg-white rounded-[24px] border border-soft-mint shadow-sm">
                    <div className="text-secondary mb-4 flex items-center gap-2">
                      <Icon name={c.icon} fill />
                      <span className="text-xs font-semibold uppercase tracking-wider">{c.label}</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-semibold mb-2">{c.title}</h3>
                    <p className="text-on-surface-variant text-sm">{c.desc}</p>
                  </div>
                ))}
              </div>
              {/* Center image */}
              <div className="relative h-[500px] flex justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-soft-mint/20 to-transparent rounded-full blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ANATOMY_IMG} alt="Vagus nerve anatomy" className="relative z-10 max-h-full object-contain" />
              </div>
              {/* Right cards */}
              <div className="space-y-6">
                {ANATOMY_RIGHT.map((c) => (
                  <div key={c.label} className="p-8 bg-white rounded-[24px] border border-soft-mint shadow-sm">
                    <div className="text-secondary mb-4 flex items-center gap-2">
                      <Icon name={c.icon} fill />
                      <span className="text-xs font-semibold uppercase tracking-wider">{c.label}</span>
                    </div>
                    <h3 className="font-montserrat text-xl font-semibold mb-2">{c.title}</h3>
                    <p className="text-on-surface-variant text-sm">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY NON-INVASIVE */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-32">
          <div className="bg-tech-blue rounded-[32px] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] mb-8">
                  Dlaczego tVNS (Przezskórny VNS)?
                </h2>
                <p className="text-lg leading-7 text-on-primary-container mb-8">
                  Historycznie stymulacja nerwu błędnego wymagała wszczepienia elektrod. GoodStim wykorzystuje gałąź uszną nerwu błędnego (ABVN), co pozwala na osiągnięcie efektów terapeutycznych bez skalpela.
                </p>
                <ul className="space-y-4">
                  {[
                    "Zero inwazyjności – brak blizn i ryzyka chirurgicznego.",
                    "Pełna kontrola – dopasuj intensywność do swojego komfortu.",
                    "Mobilność – sesja regeneracyjna w dowolnym miejscu.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <Icon name="check_circle" className="text-vibrant-teal flex-shrink-0 mt-0.5" />
                      <span className="text-on-primary-container">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Waveform visualization */}
              <div className="bg-white/5 backdrop-blur-md rounded-[24px] p-8 border border-white/10">
                <div className="flex justify-between items-end mb-8">
                  <h4 className="font-montserrat text-xl font-semibold">Stymulacja Fazowa</h4>
                  <span className="text-vibrant-teal font-bold text-sm">LIVE</span>
                </div>
                <div className="h-48 flex items-end gap-2 px-2">
                  {[40, 60, 85, 70, 95, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-vibrant-teal/40 rounded-t-lg hover:bg-vibrant-teal transition-all duration-500"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-6 flex justify-between text-xs text-on-primary-container font-semibold tracking-wide">
                  <span>0Hz</span>
                  <span>Optymalny Zakres Terapeutyczny</span>
                  <span>25Hz</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLINICAL STUDIES BENTO */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-tech-blue">Dowody Kliniczne</h2>
              <p className="text-on-surface-variant mt-2">Przegląd kluczowych publikacji naukowych potwierdzających skuteczność VNS.</p>
            </div>
            <button className="flex items-center gap-2 text-secondary font-semibold text-sm hover:underline decoration-2">
              Pobierz pełną Bibliografię (PDF)
              <Icon name="download" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Study 1 */}
            <div className="md:col-span-8 bg-white p-10 rounded-[24px] border border-soft-mint shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-soft-mint flex items-center justify-center text-secondary flex-shrink-0">
                  <Icon name="article" />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wide font-semibold">Journal of Clinical Neurophysiology (2022)</p>
                  <h4 className="font-montserrat text-xl font-semibold text-tech-blue">Redukcja poziomu Kortyzolu</h4>
                </div>
              </div>
              <p className="text-base text-on-surface-variant mb-8">
                Badanie przeprowadzone na grupie 250 pacjentów wykazało średni spadek poziomu kortyzolu we krwi o 34% po 15-minutowej sesji stymulacji ABVN w porównaniu z grupą kontrolną (sham).
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">-34%</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Stres</p>
                </div>
                <div className="h-10 w-px bg-outline-variant/30" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary">+22%</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Skupienie</p>
                </div>
              </div>
            </div>
            {/* Expert Quote */}
            <div className="md:col-span-4 bg-secondary p-10 rounded-[24px] text-white flex flex-col justify-between">
              <Icon name="format_quote" className="text-4xl opacity-50" />
              <p className="font-montserrat text-xl font-semibold italic mb-8">
                &ldquo;VNS to przyszłość medycyny prewencyjnej. Zamiast leczyć skutki stresu, regulujemy jego źródło w pniu mózgu.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold tracking-wide">Dr. Elena Volkov</p>
                <p className="text-xs opacity-70 mt-1">Neurolog, Specjalista Bio-Hacking</p>
              </div>
            </div>
            {/* HRV Card */}
            <div className="md:col-span-4 bg-soft-mint p-10 rounded-[24px] flex flex-col justify-center">
              <h4 className="font-montserrat text-xl font-semibold text-secondary mb-4">Poprawa HRV</h4>
              <p className="text-on-secondary-container text-sm mb-6">
                Regularna stymulacja (2x dziennie) prowadzi do trwałego wzrostu zmienności rytmu serca, co koreluje z lepszą odpornością psychiczną.
              </p>
              <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden">
                <div className="bg-vibrant-teal h-full w-[85%] rounded-full" />
              </div>
              <p className="mt-2 text-xs font-semibold text-on-surface-variant">85% badanych zgłasza subiektywną poprawę spokoju.</p>
            </div>
            {/* Sleep Study */}
            <div className="md:col-span-8 bg-white p-10 rounded-[24px] border border-soft-mint shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h4 className="font-montserrat text-xl font-semibold text-tech-blue mb-4">Wpływ na Fazę Deep Sleep</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Stymulacja przed snem wydłuża czas trwania fazy głębokiej o średnio 45 minut, co drastycznie przyspiesza procesy regeneracyjne i konsolidację pamięci.
                </p>
              </div>
              <div className="w-full md:w-48 h-48 rounded-[24px] overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SLEEP_IMG} alt="Deep sleep study" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-16 py-16">
          <div className="text-center bg-surface-container p-16 rounded-[40px] border border-outline-variant/10 shadow-sm">
            <h2 className="font-montserrat text-[32px] leading-[40px] font-semibold tracking-[-0.01em] text-tech-blue mb-6">
              Doświadcz nauki w praktyce
            </h2>
            <p className="text-lg leading-7 text-on-surface-variant mb-10 max-w-xl mx-auto">
              Zacznij swoją podróż ku lepszej fizjologii już dziś. Nasza 30-dniowa gwarancja satysfakcji pozwala Ci przetestować GoodStim bez ryzyka.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/shop" className="bg-tech-blue text-white px-10 py-5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all">
                Kup GoodStim
              </a>
              <button className="border-2 border-tech-blue text-tech-blue px-10 py-5 rounded-full font-semibold text-sm tracking-wide hover:bg-tech-blue hover:text-white transition-all">
                Częste Pytania
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </div>
  );
}
