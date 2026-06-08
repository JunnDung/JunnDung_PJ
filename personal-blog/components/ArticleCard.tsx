import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/article-types";

const categoryStyles: Record<string, string> = {
  Essays: "bg-stone-100 text-stone-700",
  Research: "bg-blue-50 text-blue-700",
  "Personal Notes": "bg-amber-50 text-amber-700",
  Productivity: "bg-emerald-50 text-emerald-700",
  Culture: "bg-rose-50 text-rose-700",
  Technology: "bg-cyan-50 text-cyan-700",
  Books: "bg-violet-50 text-violet-700",
  Design: "bg-orange-50 text-orange-700",
  Philosophy: "bg-indigo-50 text-indigo-700"
};

type ArticleCardProps = {
  article: Article;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="card-shine group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg">
      <Link
        href={`/posts/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-slate-100"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="px-2 pb-2 pt-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              categoryStyles[article.category] ?? "bg-slate-100 text-slate-700"
            }`}
          >
            {article.category}
          </span>
          <span className="text-xs text-slate-500">{article.readTime}</span>
        </div>

        <Link href={`/posts/${article.slug}`}>
          <h3 className="font-serif text-xl font-bold leading-snug tracking-tight text-slate-900 transition hover:text-slate-600">
            {article.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {article.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
          <Image
            src={article.authorAvatar}
            alt={article.author}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-medium text-slate-700">{article.author}</p>
            <time className="text-xs text-slate-500">{article.publishedAt}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
