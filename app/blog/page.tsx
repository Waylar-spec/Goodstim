import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogIndexClient from "../components/BlogIndexClient";
import { getSortedPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog GoodStim — nerw błędny, sen, stres i regeneracja",
  description:
    "Poradniki i artykuły o nerwie błędnym, stymulacji tVNS, lepszym śnie, redukcji stresu i regeneracji. Praktyczna wiedza dla Twojego dobrostanu.",
  keywords: [
    "blog nerw błędny",
    "stymulacja nerwu błędnego",
    "tVNS",
    "redukcja stresu",
    "lepszy sen",
    "HRV",
  ],
  openGraph: {
    title: "Blog GoodStim — nerw błędny, sen, stres i regeneracja",
    description: "Praktyczna wiedza o nerwie błędnym, tVNS, śnie i redukcji stresu.",
    type: "website",
    locale: "pl_PL",
    siteName: "GoodStim",
  },
};

export default function BlogPage() {
  const posts = getSortedPosts();
  return (
    <div className="min-h-screen bg-surface text-on-background font-sans">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-3">Blog GoodStim</p>
            <h1 className="font-montserrat text-[40px] leading-[48px] font-bold text-primary mb-4">
              Wiedza, która pomaga Ci zwolnić
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Praktyczne poradniki o nerwie błędnym, lepszym śnie, redukcji stresu i regeneracji — bez medycznego żargonu.
            </p>
          </div>
          <BlogIndexClient posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
