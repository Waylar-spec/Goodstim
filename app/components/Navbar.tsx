"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import Logo from "./Logo";
import { useCart, getLineTotal } from "../lib/cart";
import { formatPrice, getProduct, DEVICE_ID, DEVICE_ADDITIONAL_ID, TRAVEL_CASE_ID, TRAVEL_CASE_BUNDLE_PRICE, DEVICE_ADDITIONAL_PRICE } from "../lib/products";
import { trackAddToCart } from "../lib/analytics";

const NAV_LINKS = [
  { label: "Nauka", href: "/the-science" },
  { label: "Blog", href: "/blog" },
  { label: "Opinie", href: "/#reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Program partnerski", href: "/affiliate" },
];

const SHOP_ITEMS = [
  {
    name: "GoodStim",
    subtitle: "Stymulator nerwu błędnego",
    image: "/product.png",
    href: "/shop",
    comingSoon: false,
  },
  {
    name: "Żel przewodzący",
    subtitle: "Akcesorium do GoodStim",
    image: "/product.png",
    href: "/shop",
    comingSoon: true,
    locked: true,
  },
  {
    name: "Etui podróżne GoodStim",
    subtitle: "Akcesorium do GoodStim",
    image: "/case/1.avif",
    href: "/shop/etui-podrozne",
    comingSoon: false,
    locked: false,
  },
];

function ShopItemRow({ item, onNavigate }: { item: (typeof SHOP_ITEMS)[number]; onNavigate: () => void }) {
  const thumb = (
    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="44px"
        className={`object-cover ${item.comingSoon ? "grayscale" : ""}`}
      />
    </div>
  );
  const text = (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-primary truncate">{item.name}</p>
      <p className="text-[11px] text-on-surface-variant truncate">{item.subtitle}</p>
    </div>
  );
  const badge = item.comingSoon ? (
    <span className="px-2 py-1 bg-surface-container text-on-surface-variant text-[9px] font-bold uppercase tracking-wider rounded-full flex-shrink-0">
      Wkrótce
    </span>
  ) : (
    <Icon name="chevron_right" className="text-[18px] text-on-surface-variant/50 flex-shrink-0" />
  );

  if (item.locked) {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-xl opacity-60 cursor-default">
        {thumb}
        {text}
        {badge}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
    >
      {thumb}
      {text}
      {badge}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { items, addToCart, removeFromCart, setQty, total, count, cartOpen, openCart, closeCart } = useCart();
  const travelCase = getProduct(TRAVEL_CASE_ID);
  const additionalDevice = getProduct(DEVICE_ADDITIONAL_ID);
  const hasDevice = items.some((i) => i.product.id === DEVICE_ID);
  const hasCase = items.some((i) => i.product.id === TRAVEL_CASE_ID);
  const hasAdditionalDevice = items.some((i) => i.product.id === DEVICE_ADDITIONAL_ID);
  const showCaseUpsell = hasDevice && !hasCase && !!travelCase;
  const showDeviceUpsell = hasDevice && !hasAdditionalDevice && !!additionalDevice;
  const bundleActive = hasDevice && (hasCase || hasAdditionalDevice);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/20 shadow-[0px_4px_20px_rgba(37,37,55,0.04)]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 md:px-16 h-20">
          <Logo variant="light" />
          <div className="hidden md:flex items-center space-x-8">
            <div
              ref={shopRef}
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                onClick={() => setShopOpen((o) => !o)}
                className={`flex items-center gap-1 text-sm font-semibold tracking-wide transition-colors ${
                  pathname === "/shop"
                    ? "text-secondary border-b-2 border-secondary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                Sklep
                <Icon
                  name="expand_more"
                  className={`text-[18px] transition-transform ${shopOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 ${
                  shopOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="w-72 bg-white rounded-2xl border border-outline-variant/20 shadow-xl p-3 space-y-1">
                  {SHOP_ITEMS.map((item) => (
                    <ShopItemRow key={item.name} item={item} onNavigate={() => setShopOpen(false)} />
                  ))}
                </div>
              </div>
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-secondary border-b-2 border-secondary pb-1"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-6">
            <button
              className="text-on-surface-variant hover:text-primary transition-colors relative"
              onClick={() => openCart()}
              aria-label="Otwórz koszyk"
            >
              <Icon name="shopping_bag" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-vibrant-teal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </button>
            <button
              className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              <Icon name={mobileMenuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[65] transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] bg-white shadow-[0px_0px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 md:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <span className="font-montserrat text-xl font-bold text-primary">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Zamknij menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Sklep</p>
            <div className="space-y-1">
              {SHOP_ITEMS.map((item) => (
                <ShopItemRow key={item.name} item={item} onNavigate={() => setMobileMenuOpen(false)} />
              ))}
            </div>
          </div>
          <div className="space-y-1 pt-2 border-t border-outline-variant/10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-base font-semibold transition-colors ${
                    isActive ? "text-secondary" : "text-primary hover:text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => closeCart()}
      />

      {/* Cart Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full md:w-[420px] z-[60] bg-white transition-transform duration-500 shadow-[0px_0px_40px_rgba(0,0,0,0.1)] flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-outline-variant/20">
          <div>
            <h3 className="font-montserrat text-xl font-bold text-tech-blue">Twój koszyk</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {count === 0 ? "Koszyk jest pusty" : `${count} ${count === 1 ? "produkt" : "produkty"}`}
            </p>
          </div>
          <button className="text-tech-blue hover:text-primary transition-colors mt-1" onClick={() => closeCart()}>
            <Icon name="close" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow px-6 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-soft-mint flex items-center justify-center">
                <Icon name="shopping_bag" className="text-secondary text-3xl" />
              </div>
              <p className="text-on-surface-variant font-semibold">Dodaj produkty do koszyka</p>
              <Link
                href="/shop"
                onClick={() => closeCart()}
                className="px-6 py-3 bg-tech-blue text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors"
              >
                Przejdź do sklepu
              </Link>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 pb-4 border-b border-outline-variant/15 last:border-0">
                {/* Image */}
                <div className="relative w-20 h-20 bg-surface-container rounded-xl flex-shrink-0 overflow-hidden">
                  <Image src={product.image} alt={product.name} fill sizes="80px" className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-primary truncate">{product.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{product.subtitle}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="flex-shrink-0 text-on-surface-variant/50 hover:text-error transition-colors"
                      aria-label="Usuń z koszyka"
                    >
                      <Icon name="close" className="text-[18px]" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-0.5">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Zmniejsz ilość"
                      >
                        <Icon name="remove" className="text-[16px]" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-primary">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        aria-label="Zwiększ ilość"
                      >
                        <Icon name="add" className="text-[16px]" />
                      </button>
                    </div>

                    {/* Price */}
                    {(product.id === TRAVEL_CASE_ID && product.price === TRAVEL_CASE_BUNDLE_PRICE) ||
                    (product.id === DEVICE_ADDITIONAL_ID && product.price === DEVICE_ADDITIONAL_PRICE) ? (
                      <span className="text-sm">
                        <span className="text-on-surface-variant/60 line-through mr-1.5">
                          {formatPrice(((product.id === TRAVEL_CASE_ID ? travelCase?.price : additionalDevice?.price) ?? product.price) * qty)}
                        </span>
                        <span className="font-bold text-secondary">{formatPrice(product.price * qty)}</span>
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-secondary">{formatPrice(getLineTotal({ product, qty }))}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upsell: etui w cenie promocyjnej + dodatkowe urządzenie w cenie obniżonej */}
        {(showCaseUpsell || showDeviceUpsell) && (
          <div className="px-6 pb-4 space-y-3">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Polecane dla Ciebie</p>

            {showDeviceUpsell && additionalDevice && (
              <div className="flex items-center gap-3 p-3 bg-soft-mint rounded-2xl border border-vibrant-teal/20">
                <div className="relative w-14 h-14 bg-white rounded-xl flex-shrink-0 overflow-hidden">
                  <Image src={additionalDevice.image} alt={additionalDevice.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">Dodatkowe urządzenie GoodStim</p>
                  <p className="text-xs text-on-surface-variant">
                    <span className="line-through opacity-60 mr-1.5">{formatPrice(additionalDevice.price)}</span>
                    <span className="text-secondary font-bold">{formatPrice(DEVICE_ADDITIONAL_PRICE)}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    addToCart(additionalDevice);
                    trackAddToCart({ id: additionalDevice.id, name: additionalDevice.name, price: DEVICE_ADDITIONAL_PRICE });
                  }}
                  className="flex-shrink-0 px-4 py-2 bg-tech-blue text-white text-xs font-semibold rounded-full hover:bg-primary transition-colors flex items-center gap-1"
                >
                  <Icon name="add" className="text-[16px]" />
                  Dodaj
                </button>
              </div>
            )}

            {showCaseUpsell && travelCase && (
              <div className="flex items-center gap-3 p-3 bg-soft-mint rounded-2xl border border-vibrant-teal/20">
                <div className="relative w-14 h-14 bg-white rounded-xl flex-shrink-0 overflow-hidden">
                  <Image src={travelCase.image} alt={travelCase.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{travelCase.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    <span className="line-through opacity-60 mr-1.5">{formatPrice(travelCase.price)}</span>
                    <span className="text-secondary font-bold">{formatPrice(TRAVEL_CASE_BUNDLE_PRICE)} w zestawie</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    addToCart(travelCase);
                    trackAddToCart({ id: travelCase.id, name: travelCase.name, price: TRAVEL_CASE_BUNDLE_PRICE });
                  }}
                  className="flex-shrink-0 px-4 py-2 bg-tech-blue text-white text-xs font-semibold rounded-full hover:bg-primary transition-colors flex items-center gap-1"
                >
                  <Icon name="add" className="text-[16px]" />
                  Dodaj
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 space-y-4 bg-surface-container-lowest">
            {bundleActive && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-soft-mint px-3 py-1.5 rounded-full w-fit">
                <Icon name="local_offer" className="text-[14px]" fill />
                Bundle Deal —{" "}
                {hasCase && hasAdditionalDevice
                  ? "etui i dodatkowe urządzenie w cenie zestawu"
                  : hasCase
                  ? "etui w cenie zestawu"
                  : "dodatkowe urządzenie w cenie zestawu"}
              </div>
            )}
            <div className="flex justify-between font-bold text-tech-blue text-lg">
              <span>Razem</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <Icon name="local_shipping" className="text-[16px] text-secondary" />
              Darmowa dostawa · 14-dniowa gwarancja zwrotu
            </p>
            <Link
              href="/checkout"
              className="block w-full py-4 bg-tech-blue text-white rounded-xl font-bold hover:bg-primary transition-all text-center"
              onClick={() => closeCart()}
            >
              Przejdź do kasy
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
