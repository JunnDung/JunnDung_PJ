import { ArticleStatus, type Article as DbArticle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Article, ArticleSection } from "@/lib/article-types";
import { siteConfig } from "@/lib/site";

type ArticleWithTags = DbArticle & {
  tags: { name: string }[];
};

type SearchOptions = {
  q?: string;
  topic?: string;
  sort?: "latest" | "readTime" | "title";
  page?: number;
  pageSize?: number;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function toArticleView(article: ArticleWithTags): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    readTime: article.readTime,
    publishedAt: formatDate(article.publishedAt),
    publishedDate: article.publishedAt?.toISOString().slice(0, 10) ?? "",
    author: article.author,
    authorAvatar: article.authorAvatar,
    coverImage: article.coverImage,
    tags: article.tags.map((tag) => tag.name),
    featured: article.featured,
    sections: article.sections as ArticleSection[]
  };
}

const articleInclude = {
  tags: {
    select: { name: true }
  }
};

async function safePrismaQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[DB] Query failed, using fallback:", error);
    return fallback;
  }
}

export async function getAllArticles({ includeDrafts = false } = {}) {
  return safePrismaQuery(
    async () => {
      const articles = await prisma.article.findMany({
        where: includeDrafts ? undefined : { status: ArticleStatus.PUBLISHED },
        include: articleInclude,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
      });
      return articles.map(toArticleView);
    },
    []
  );
}

export async function getTopics() {
  return safePrismaQuery(
    async () => {
      const categories = await prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
        distinct: ["category"],
        select: { category: true },
        orderBy: { category: "asc" }
      });
      return ["All", ...categories.map((item) => item.category)];
    },
    ["All"]
  );
}

export async function getFeaturedArticle() {
  return safePrismaQuery(
    async () => {
      const article = await prisma.article.findFirst({
        where: { status: ArticleStatus.PUBLISHED, featured: true },
        include: articleInclude,
        orderBy: { publishedAt: "desc" }
      });

      if (article) {
        return toArticleView(article);
      }

      const fallback = await prisma.article.findFirst({
        where: { status: ArticleStatus.PUBLISHED },
        include: articleInclude,
        orderBy: { publishedAt: "desc" }
      });

      return fallback ? toArticleView(fallback) : null;
    },
    null
  );
}

export async function getArticleBySlug(slug: string, { includeDrafts = false } = {}) {
  return safePrismaQuery(
    async () => {
      const article = await prisma.article.findFirst({
        where: {
          slug,
          ...(includeDrafts ? {} : { status: ArticleStatus.PUBLISHED })
        },
        include: articleInclude
      });
      return article ? toArticleView(article) : null;
    },
    null
  );
}

export async function getArticleById(id: string) {
  return safePrismaQuery(
    async () => {
      const article = await prisma.article.findUnique({
        where: { id },
        include: articleInclude
      });
      return article ? toArticleView(article) : null;
    },
    null
  );
}

export function getArticleUrl(slug: string) {
  return `${siteConfig.url}/posts/${slug}`;
}

export async function getRelatedArticles(slug: string, limit = 3) {
  const current = await getArticleBySlug(slug);

  if (!current) {
    return (await getAllArticles()).slice(0, limit);
  }

  const all = await getAllArticles();

  return all
    .filter((article) => article.slug !== slug)
    .map((article) => {
      const categoryScore = article.category === current.category ? 3 : 0;
      const tagScore = article.tags.filter((tag) => current.tags.includes(tag)).length;
      return { article, score: categoryScore + tagScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article)
    .slice(0, limit);
}

function readTimeValue(readTime: string) {
  const match = readTime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export async function searchArticles({ q = "", topic = "All", sort = "latest", page = 1, pageSize = 12 }: SearchOptions) {
  return safePrismaQuery(
    async () => {
      const normalizedQuery = q.trim().toLowerCase();
      const skip = (page - 1) * pageSize;

      const where = {
        status: ArticleStatus.PUBLISHED,
        ...(topic && topic !== "All" ? { category: topic } : {}),
        ...(normalizedQuery ? { searchText: { contains: normalizedQuery, mode: "insensitive" as const } } : {})
      };

      const [total, rows] = await Promise.all([
        prisma.article.count({ where }),
        prisma.article.findMany({
          where,
          include: articleInclude,
          orderBy: sort === "title" ? { title: "asc" } : { publishedAt: "desc" },
          skip,
          take: pageSize
        })
      ]);

      const items = rows.map(toArticleView);

      if (sort === "readTime") {
        items.sort((a, b) => readTimeValue(a.readTime) - readTimeValue(b.readTime));
      }

      return {
        items,
        total,
        page,
        pageSize,
        hasMore: skip + items.length < total
      };
    },
    { items: [], total: 0, page, pageSize, hasMore: false }
  );
}

export function getArticleStructuredData(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    mainEntityOfPage: getArticleUrl(article.slug),
    keywords: article.tags.join(", ")
  };
}
