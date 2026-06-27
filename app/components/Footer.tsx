import Link from "next/link";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-tech-blue text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-20 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</div>
          <p className="text-base text-on-primary-container leading-relaxed">
            Osobisty stymulator nerwu błędnego do codziennego wsparcia równowagi układu nerwowego i jakości snu.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-vibrant-teal transition-colors"
              href="mailto:kontakt@goodstim.pl"
              aria-label="Email"
            >
              <Icon name="mail" className="text-[18px]" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h5 className="text-sm font-semibold tracking-wide text-vibrant-teal uppercase">Sklep</h5>
            <ul className="space-y-4">
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/shop">Kup GoodStim</Link></li>
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/shop#accessories">Akcesoria</Link></li>
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/checkout">Zamów teraz</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm font-semibold tracking-wide text-vibrant-teal uppercase">Technologia</h5>
            <ul className="space-y-4">
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/the-science">Badania naukowe</Link></li>
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/the-science">Jak to działa</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-sm font-semibold tracking-wide text-vibrant-teal uppercase">Pomoc i prawo</h5>
            <ul className="space-y-4">
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/regulamin">Regulamin sklepu</Link></li>
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/polityka-prywatnosci">Polityka prywatności</Link></li>
              <li><Link className="text-on-primary-container hover:text-white transition-colors text-sm" href="/regulamin#zwroty">Zwroty i reklamacje</Link></li>
              <li>
                <a className="text-on-primary-container hover:text-white transition-colors text-sm" href="mailto:kontakt@goodstim.pl">
                  kontakt@goodstim.pl
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-primary-container">
        <span>© {new Date().getFullYear()} GoodStim · Wojciech Dymek diagnostyka i leczenie bólu · NIP 7182160692</span>
        <div className="flex gap-6">
          <Link href="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
          <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka prywatności</Link>
        </div>
      </div>
    </footer>
  );
}
