declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}

export function trackViewItem(item: { id: string; name: string; price: number }) {
  gtag("view_item", {
    currency: "PLN",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: 1 }],
  });
}

export function trackAddToCart(item: { id: string; name: string; price: number; qty?: number }) {
  gtag("add_to_cart", {
    currency: "PLN",
    value: item.price * (item.qty ?? 1),
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.qty ?? 1 }],
  });
}

export function trackBeginCheckout(
  items: Array<{ product: { id: string; name: string; price: number }; qty: number }>,
  value: number
) {
  gtag("begin_checkout", {
    currency: "PLN",
    value,
    items: items.map(({ product, qty }) => ({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: qty,
    })),
  });
}

export function trackPurchase(
  orderId: string,
  value: number,
  items: Array<{ name: string; qty: number; price: number }>
) {
  gtag("purchase", {
    transaction_id: orderId,
    currency: "PLN",
    value,
    items: items.map((item) => ({
      item_name: item.name,
      price: item.price,
      quantity: item.qty ?? 1,
    })),
  });
}

export function trackViewCart(
  items: Array<{ product: { id: string; name: string; price: number }; qty: number }>,
  value: number
) {
  gtag("view_cart", {
    currency: "PLN",
    value,
    items: items.map(({ product, qty }) => ({
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: qty,
    })),
  });
}
