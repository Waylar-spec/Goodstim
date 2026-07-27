"use client";
import { createContext, useContext, useReducer, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "./products";
import { DEVICE_ID, TRAVEL_CASE_ID, TRAVEL_CASE_BUNDLE_PRICE, DEVICE_ADDITIONAL_PRICE } from "./products";

const STORAGE_KEY = "goodstim_cart";

export type CartItem = { product: Product; qty: number };

// Pierwsza sztuka urządzenia w cenie katalogowej, każda kolejna (np. drugi zestaw) w cenie
// obniżonej — liczone wprost, a nie przez uśrednianie product.price, żeby uniknąć błędów
// zaokrągleń przy większych ilościach.
export function getLineTotal(item: CartItem): number {
  if (item.product.id === DEVICE_ID && item.qty > 1) {
    return item.product.price + (item.qty - 1) * DEVICE_ADDITIONAL_PRICE;
  }
  return item.product.price * item.qty;
}
type State = { items: CartItem[] };
type Action =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, qty: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.product.id !== action.id) };
    case "SET_QTY":
      if (action.qty <= 0)
        return { items: state.items.filter((i) => i.product.id !== action.id) };
      return {
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartCtx = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

function loadCart(): State {
  if (typeof window === "undefined") return { items: [] };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product) => dispatch({ type: "ADD", product });
  const removeFromCart = (id: string) => dispatch({ type: "REMOVE", id });
  const setQty = (id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty });
  const clearCart = () => dispatch({ type: "CLEAR" });
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // Etui jest w cenie promocyjnej tylko dopóki urządzenie jest w koszyku — jeśli je usuniesz,
  // etui automatycznie wraca do ceny standardowej.
  const items = useMemo(() => {
    const hasDevice = state.items.some((i) => i.product.id === DEVICE_ID);
    if (!hasDevice) return state.items;
    return state.items.map((i) =>
      i.product.id === TRAVEL_CASE_ID
        ? { ...i, product: { ...i.product, price: TRAVEL_CASE_BUNDLE_PRICE } }
        : i
    );
  }, [state.items]);

  const total = items.reduce((s, i) => s + getLineTotal(i), 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, setQty, clearCart, total, count, cartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
