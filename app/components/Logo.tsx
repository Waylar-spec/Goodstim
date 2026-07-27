import Link from "next/link";

// Współrzędne "dendrytów" — uproszczona (4-ramienna) wersja sygnetu z projektu
// "GoodStim Logo Final", dobrana pod czytelność w małej skali (nawigacja/stopka).
const DENDRITES = [
  { x: 32.79, y: 25.43, op: 0.9 },
  { x: 72.63, y: 27.37, op: 0.9 },
  { x: 77.71, y: 66.0, op: 0.7 },
  { x: 22.81, y: 62.68, op: 0.7 },
];

export default function Logo({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const isDark = variant === "dark";
  const lineColor = isDark ? "#2ecc71" : "#26a95e";
  const dotColor = isDark ? "#7df0ae" : "#26a95e";
  const centerColor = isDark ? "#2ecc71" : "#1a2332";
  const goodColor = isDark ? "#ffffff" : "#1a2332";

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" width="34" height="34" className="flex-shrink-0">
        {DENDRITES.map((d, i) => (
          <line key={`l${i}`} x1="50" y1="50" x2={d.x} y2={d.y} stroke={lineColor} strokeWidth="3.4" strokeLinecap="round" opacity={d.op} />
        ))}
        {DENDRITES.map((d, i) => (
          <circle key={`c${i}`} cx={d.x} cy={d.y} r="5.1" fill={dotColor} opacity={Math.min(1, d.op + 0.15)} />
        ))}
        <circle cx="50" cy="50" r="9" fill={centerColor} />
      </svg>
      <span className="font-[family-name:var(--font-logo)] text-2xl leading-none tracking-tight">
        <span style={{ color: goodColor, fontWeight: 500 }}>Good</span>
        <span style={{ color: "#2ecc71", fontWeight: 700 }}>Stim</span>
      </span>
    </Link>
  );
}
