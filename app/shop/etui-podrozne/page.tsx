import type { Metadata } from "next";
import TravelCaseClient from "../../components/TravelCaseClient";

export const metadata: Metadata = {
  title: "Etui podróżne GoodStim — Wkrótce w sprzedaży",
  description:
    "Etui podróżne GoodStim to nadchodzący akcesorium do bezpiecznego przechowywania i transportu Twojego stymulatora nerwu błędnego. Premiera wkrótce.",
  robots: { index: false, follow: false },
};

export default function TravelCasePage() {
  return <TravelCaseClient />;
}
