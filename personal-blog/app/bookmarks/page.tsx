import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { requireUser } from "@/lib/auth";
import { getArticleById } from "@/lib/articles";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const user = await requireUser();
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { articleId: true }
  });

  const articles = (await Promise.all(bookmarks.map((bookmark) => getArticleById(bookmark.articleId)))).filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Bookmarks</p>
        <h1 className="font-serif text-4xl font-black text-slate-950">Saved for later</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">A private reading shelf tied to your account.</p>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => article && <ArticleCard key={article.id} article={article} />)}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">No saved essays yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Save essays from article pages and return here later.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">Browse archive</Link>
        </div>
      )}
    </main>
  );
}
