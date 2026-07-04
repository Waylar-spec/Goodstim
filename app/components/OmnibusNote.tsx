import { getOmnibusReferencePrice, formatPrice, type Product } from "../lib/products";

export default function OmnibusNote({ product, className = "" }: { product: Product; className?: string }) {
  const lowest = getOmnibusReferencePrice(product);
  if (lowest == null) return null;

  return (
    <p className={`text-xs text-on-surface-variant/70 ${className}`}>
      Najniższa cena z 30 dni przed obniżką: {formatPrice(lowest)}
    </p>
  );
}
