import Image from "next/image";
import ArticleCard from "@/components/ArticleCard";
import FeaturedPost from "@/components/FeaturedPost";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import SubscribeBox from "@/components/SubscribeBox";
import { getAllArticles, getFeaturedArticle, getTopics } from "@/lib/articles";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, allArticles, topics] = await Promise.all([
    getFeaturedArticle(),
    getAllArticles(),
    getTopics()
  ]);

  if (!featured) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl font-black text-slate-950">No articles yet</h1>
        <p className="mt-4 text-slate-500">Seed database to publish first essays.</p>
      </main>
    );
  }

  const remaining = allArticles.filter((article) => article.slug !== featured.slug);
  const popular = remaining.slice(0, 3);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8 lg:px-10">
        <FeaturedPost article={featured} />
      </section>

      <section className="border-y border-slate-200 bg-white/50">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="font-serif text-3xl font-black text-slate-950">{allArticles.length}</p>
              <p className="mt-1 text-sm text-slate-500">long-form essays</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="font-serif text-3xl font-black text-slate-950">{Math.max(topics.length - 1, 0)}</p>
              <p className="mt-1 text-sm text-slate-500">research topics</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <p className="font-serif text-3xl font-black text-slate-950">0</p>
              <p className="mt-1 text-sm text-slate-500">noise, ads, distractions</p>
            </div>
          </div>
        </div>
      </section>

      <SearchFilterPanel articles={remaining} topics={topics} />

      <section className="mx-auto max-w-5xl px-5 py-4 sm:px-8">
        <SubscribeBox />
      </section>

      <section id="notes" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Popular Reads
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
            Essays worth returning to
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-white/55">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[180px_1fr]">
          <Image
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
            alt="Dũng Nguyễn Việt"
            width={128}
            height={128}
            className="h-32 w-32 rounded-full object-cover ring-1 ring-slate-200"
          />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              About the author
            </p>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Dũng Nguyễn Việt
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Writer and researcher interested in technology, intellectual life,
              design, books, and slow systems of thought. This blog collects
              essays, research fragments, and personal notes for readers who
              value careful analysis.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
              <a className="hover:text-slate-950" href="mailto:hello@example.com">
                hello@example.com
              </a>
              <span>·</span>
              <a className="hover:text-slate-950" href="#">
                Twitter/X
              </a>
              <span>·</span>
              <a className="hover:text-slate-950" href="#">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
