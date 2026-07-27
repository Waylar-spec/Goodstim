import type { Metadata } from "next";
import TravelCaseClient from "../../components/TravelCaseClient";

export const metadata: Metadata = {
  title: "Etui podróżne GoodStim — 49 zł",
  description:
    "Etui podróżne GoodStim to twarde, wytrzymałe etui do bezpiecznego przechowywania i transportu Twojego stymulatora nerwu błędnego. 49 zł, 39 zł w zestawie z urządzeniem.",
};

export default function TravelCasePage() {
  return <TravelCaseClient />;
}
