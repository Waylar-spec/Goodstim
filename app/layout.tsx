import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "GoodStim — Stymulator Nerwu Błędnego | Technologia VNS",
    template: "%s | GoodStim",
  },
  description:
    "GoodStim to zaawansowany stymulator nerwu błędnego, który przywraca równowagę układowi nerwowemu w zaledwie 15 minut dziennie.",
  metadataBase: new URL("https://goodstim.pl"),
  openGraph: {
    siteName: "GoodStim",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans"><Providers>{children}</Providers></body>
    </html>
  );
}
