import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-tech-blue text-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-20 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="font-montserrat text-2xl font-bold text-vibrant-teal">GoodStim</div>
          <p className="text-base text-on-primary-container leading-relaxed">
            Technologia stymulatora nerwu błędnego klasy medycznej do codziennej optymalizacji zdrowia i dobrostanu.
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-vibrant-teal transition-colors" href="#">
              <Icon name="share" className="text-[18px]" />
            </a>
            <a className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-vibrant-teal transition-colors" href="#">
              <Icon name="language" className="text-[18px]" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div className="space-y-6">
            <h5 className="text-sm font-semibold tracking-wide text-vibrant-teal uppercase">Technologia</h5>
            <ul className="space-y-4">
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="/the-science">Badania naukowe</a></li>
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="/the-science">Jak to działa</a></li>
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="/shop">Cennik</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-sm font-semibold tracking-wide text-vibrant-teal uppercase">Firma</h5>
            <ul className="space-y-4">
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="#">Polityka prywatności</a></li>
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="#">Polityka zwrotów</a></li>
              <li><a className="text-on-primary-container hover:text-white transition-colors text-sm" href="#">Kontakt</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-8 border-t border-white/10 text-xs text-on-primary-container text-center md:text-left">
        © 2024 GoodStim. Technologia stymulatora nerwu błędnego klasy medycznej. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
