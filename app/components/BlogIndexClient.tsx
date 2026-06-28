"use client";

import { useState } from "react";
import Link from "next/link";
import { BlogPost, CATEGORIES } from "../lib/blog";

const CAT_COLORS: Record<string, string> = {
  Sen: "bg-indigo-100 text-indigo-700",
  Stres: "bg-emerald-100 text-emerald-700",
  Nauka: "bg-blue-100 text-blue-700",
  Regeneracja: "bg-orange-100 text-orange-700",
  Poradnik: "bg-purple-100 text-purple-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [cat, setCat] = useState<string>("Wszystkie");
  const filtered = cat === "Wszystkie" ? posts : posts.filter((p) => p.category === cat);
  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              cat === c ? "bg-tech-blue text-white" : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-on-surface-variant py-16 text-center">Brak artykułów w tej kategorii.</p>
      )}

      {/* Featured post */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block mb-12 rounded-3xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest hover:shadow-xl transition-shadow"
        >
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-tech-blue to-primary flex items-center justify-center py-16 text-[80px]">
              {featured.cover}
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${CAT_COLORS[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="text-xs text-on-surface-variant">{featured.readMin} min czytania</span>
              </div>
              <h2 className="font-montserrat text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                {featured.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed mb-4">{featured.excerpt}</p>
              <span className="text-sm font-semibold text-secondary">Czytaj więcej →</span>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest hover:shadow-lg transition-shadow"
          >
            <div className="bg-gradient-to-br from-soft-mint to-surface-container flex items-center justify-center py-12 text-[56px]">
              {post.cover}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CAT_COLORS[post.category]}`}>
                  {post.category}
                </span>
                <span className="text-xs text-on-surface-variant">{post.readMin} min</span>
              </div>
              <h3 className="font-montserrat text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
              <p className="text-xs text-on-surface-variant mt-4">{formatDate(post.date)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
