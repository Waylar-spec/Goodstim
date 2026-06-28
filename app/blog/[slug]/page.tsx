import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPost, getAllSlugs, getRelated, BLOG_IMAGES } from "../../lib/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artykuł nie znaleziony" };
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      locale: "pl_PL",
      siteName: "GoodStim",
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.metaDescription },
  };
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelated(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { "@type": "Organization", name: "GoodStim" },
    publisher: { "@type": "Organization", name: "GoodStim" },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-32 pb-24">
        <article className="max-w-[720px] mx-auto px-6">
          <Link href="/blog" className="text-sm text-secondary font-semibold hover:underline mb-8 inline-block">
            ← Wróć do bloga
          </Link>

          {/* Header */}
          <div className="mb-10">
            {BLOG_IMAGES[post.slug] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={BLOG_IMAGES[post.slug]}
                alt={post.title}
                className="w-full rounded-3xl object-cover aspect-[16/7] mb-8"
              />
            ) : (
              <div className="text-center text-[64px] mb-4">{post.cover}</div>
            )}
            <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${CAT_COLORS[post.category]}`}>
                {post.category}
              </span>
              <span className="text-xs text-on-surface-variant">{post.readMin} min czytania</span>
              <span className="text-xs text-on-surface-variant">· {formatDate(post.date)}</span>
            </div>
            <h1 className="font-montserrat text-[34px] leading-[42px] font-bold text-primary">{post.title}</h1>
            </div>
          </div>

          {/* Body */}
          <div
            className="blog-content max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-tech-blue to-primary text-center text-white">
            <h3 className="font-montserrat text-2xl font-bold mb-2">Wypróbuj GoodStim</h3>
            <p className="text-on-primary-container mb-6 max-w-md mx-auto">
              Wesprzyj swój codzienny relaks dzięki przezskórnej stymulacji nerwu błędnego.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-vibrant-teal text-white px-8 py-4 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Zobacz w sklepie — 550 PLN
            </Link>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <div className="max-w-[1100px] mx-auto px-6 md:px-16 mt-20">
            <h2 className="font-montserrat text-2xl font-bold text-primary mb-8">Czytaj dalej</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest hover:shadow-lg transition-shadow"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-soft-mint to-surface-container aspect-[16/9]">
                    {BLOG_IMAGES[r.slug] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={BLOG_IMAGES[r.slug]} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[48px]">{r.cover}</div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CAT_COLORS[r.category]}`}>
                      {r.category}
                    </span>
                    <h3 className="font-montserrat text-base font-bold text-primary mt-3 group-hover:text-secondary transition-colors leading-snug">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
