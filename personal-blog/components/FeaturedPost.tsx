import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/data/articles";

type FeaturedPostProps = {
  article: Article;
};

export default function FeaturedPost({ article }: FeaturedPostProps) {
  return (
    <article className="grid gap-8 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-14">
      <Link
        href={`/posts/${article.slug}`}
        className="group relative aspect-[16/11] overflow-hidden rounded-2xl border border-slate-200 bg-white"
      >
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="lg:pl-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          {article.category}
        </p>
        <Link href={`/posts/${article.slug}`}>
          <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-slate-950 transition hover:text-slate-700 md:text-6xl">
            {article.title}
          </h1>
        </Link>
        <p className="mt-6 text-lg leading-8 text-slate-600">{article.excerpt}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <Image
            src={article.authorAvatar}
            alt={article.author}
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-medium text-slate-700">{article.author}</span>
          <span>·</span>
          <time>{article.publishedAt}</time>
          <span>·</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}
