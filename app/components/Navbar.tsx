"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/products";

const NAV_LINKS = [
  { label: "Sklep", href: "/shop" },
  { label: "Nauka", href: "/the-science" },
  { label: "Blog", href: "/blog" },
  { label: "Opinie", href: "/#reviews" },
];

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const { items, removeFromCart, setQty, total, count } = useCart();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/20 shadow-[0px_4px_20px_rgba(37,37,55,0.04)]">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 md:px-16 h-20">
          <Link href="/" className="font-montserrat text-2xl font-bold tracking-tight text-primary">
            GoodStim
          </Link>
          <div className="hidden md:flex items-center space-x-8">
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
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Icon name="person" />
            </button>
            <button
              className="text-on-surface-variant hover:text-primary transition-colors relative"
              onClick={() => setCartOpen(true)}
              aria-label="Otwórz koszyk"
            >
              <Icon name="shopping_bag" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-vibrant-teal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
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
          <button className="text-tech-blue hover:text-primary transition-colors mt-1" onClick={() => setCartOpen(false)}>
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
                onClick={() => setCartOpen(false)}
                className="px-6 py-3 bg-tech-blue text-white text-sm font-semibold rounded-full hover:bg-primary transition-colors"
              >
                Przejdź do sklepu
              </Link>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 pb-4 border-b border-outline-variant/15 last:border-0">
                {/* Image */}
                <div className="w-20 h-20 bg-surface-container rounded-xl flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
                    <span className="text-sm font-bold text-secondary">{formatPrice(product.price * qty)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 space-y-4 bg-surface-container-lowest">
            <div className="flex justify-between font-bold text-tech-blue text-lg">
              <span>Razem</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <Icon name="local_shipping" className="text-[16px] text-secondary" />
              Darmowa dostawa · 30-dniowa gwarancja zwrotu
            </p>
            <Link
              href="/checkout"
              className="block w-full py-4 bg-tech-blue text-white rounded-xl font-bold hover:bg-primary transition-all text-center"
              onClick={() => setCartOpen(false)}
            >
              Przejdź do kasy
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
