import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import BackToTop from "@/components/BackToTop";
import PostActions from "@/components/PostActions";
import PostProgressBar from "@/components/PostProgressBar";
import ReadingPreferences from "@/components/ReadingPreferences";
import TableOfContents from "@/components/TableOfContents";
import { getCurrentUser } from "@/lib/auth";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleStructuredData,
  getArticleUrl,
  getRelatedArticles
} from "@/lib/articles";
import { prisma } from "@/lib/prisma";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Post not found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/posts/${article.slug}` },
    authors: [{ name: article.author }],
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/posts/${article.slug}`,
      images: [article.coverImage],
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
      tags: article.tags
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage]
    }
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [related, user] = await Promise.all([getRelatedArticles(article.slug), getCurrentUser()]);
  const isBookmarked = user
    ? Boolean(
        await prisma.bookmark.findUnique({
          where: { userId_articleId: { userId: user.id, articleId: article.id } }
        })
      )
    : false;
  const articleUrl = getArticleUrl(article.slug);
  const structuredData = getArticleStructuredData(article);
  const tocItems = article.sections.map((section) => ({ id: section.id, title: section.title }));

  return (
    <main>
      <PostProgressBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <article className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <header className="mx-auto max-w-3xl py-10 text-center reveal-up">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{article.category}</p>
          <h1 className="font-serif text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">{article.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <Image src={article.authorAvatar} alt={article.author} width={40} height={40} className="rounded-full" />
            <span className="font-medium text-slate-700">{article.author}</span>
            <span>·</span>
            <time dateTime={article.publishedDate}>{article.publishedAt}</time>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        <div className="relative mx-auto mb-14 aspect-[16/8] max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Image src={article.coverImage} alt={article.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,var(--reading-width))_260px] lg:justify-center">
          <aside className="hidden lg:block"><TableOfContents items={tocItems} /></aside>

          <div className="min-w-0">
            <div className="mb-8 grid gap-4 lg:hidden">
              <PostActions title={article.title} url={articleUrl} slug={article.slug} articleId={article.id} isBookmarked={isBookmarked} isAuthenticated={Boolean(user)} />
              <ReadingPreferences />
            </div>

            <div className="prose-editorial text-slate-700">
              {article.sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {index === 1 && <blockquote>“A tool is never neutral when it decides which forms of attention feel natural.”</blockquote>}
                  {index === 2 && (
                    <div className="relative my-8 aspect-[16/9] overflow-hidden rounded-xl border border-slate-200">
                      <Image src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop" alt="Desk with research notes" fill sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
                    </div>
                  )}
                  {index === 3 && (
                    <>
                      <div className="note"><strong className="text-slate-800">Research note:</strong> preserve friction where judgment needs time. Remove friction where repetition wastes attention.</div>
                      <pre><code>{`const usefulFriction = {
  protectsAttention: true,
  slowsReaction: true,
  improvesJudgment: true
};`}</code></pre>
                    </>
                  )}
                </section>
              ))}
            </div>

            <footer className="mt-14 border-t border-slate-200 pt-8">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">#{tag}</span>)}
              </div>
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <Image src={article.authorAvatar} alt={article.author} width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">{article.author}</h3>
                    <p className="mt-2 leading-7 text-slate-600">Writes reflective essays on technology, culture, books, design, and philosophy. Interested in slow systems, serious reading, and humane digital environments.</p>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <aside className="hidden space-y-4 xl:block">
            <div className="sticky top-28 space-y-4">
              <PostActions title={article.title} url={articleUrl} slug={article.slug} articleId={article.id} isBookmarked={isBookmarked} isAuthenticated={Boolean(user)} />
              <ReadingPreferences />
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 text-sm leading-7 text-slate-500 shadow-sm backdrop-blur">
                <p className="font-serif text-lg font-bold text-slate-800">Private margin</p>
                <p className="mt-2">Read slowly. Mark disagreement. Return later.</p>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Related Posts</p>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Continue reading</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((relatedArticle) => <ArticleCard key={relatedArticle.id} article={relatedArticle} />)}
        </div>
      </section>

      <BackToTop />
    </main>
  );
}
