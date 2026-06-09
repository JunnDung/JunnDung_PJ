export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  publishedDate: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  sections: ArticleSection[];
};

export const siteConfig = {
  name: "Private Margins",
  description:
    "Thoughtful essays and research notes on ideas, technology, design, books, and philosophy.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  author: "Dũng Nguyễn Việt"
};

export const topics = [
  "All",
  "Essays",
  "Research",
  "Personal Notes",
  "Productivity",
  "Culture",
  "Technology",
  "Books",
  "Ideas",
  "Philosophy",
  "Design"
];

const authorAvatar =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop";

const baseSections: ArticleSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    paragraphs: [
      "Every serious essay begins with a pressure that ordinary language cannot yet hold. The task is not to rush toward certainty, but to build enough space for the question to become exact.",
      "This piece belongs to that slower tradition: writing as an instrument for attention, not performance."
    ]
  },
  {
    id: "main-argument",
    title: "Main Argument",
    paragraphs: [
      "The central claim is modest but demanding: intellectual life needs protected rhythms. Without them, thought becomes reactive, optimized for response rather than understanding.",
      "Tools, institutions, and personal habits all shape what kinds of reflection remain possible. Design therefore becomes more than surface; it becomes an ethics of attention."
    ]
  },
  {
    id: "historical-context",
    title: "Historical Context",
    paragraphs: [
      "Older forms of scholarship assumed delay. Letters travelled slowly, books circulated through marginalia, and ideas developed through return rather than instant exchange.",
      "That slowness was not inefficiency alone. It gave judgment time to separate itself from reaction."
    ]
  },
  {
    id: "key-observations",
    title: "Key Observations",
    paragraphs: [
      "Good systems do not remove all friction. They preserve friction where decisions require care and remove it where repetition wastes attention.",
      "The more automated life becomes, the more valuable deliberate pauses become. Serious work depends on knowing where to slow down."
    ]
  },
  {
    id: "conclusion",
    title: "Conclusion",
    paragraphs: [
      "To write, read, design, or think well now is to defend duration. Not every problem can be solved by speed, and not every insight arrives under pressure.",
      "A humane intellectual culture would treat attention as finite, shared, and worthy of protection."
    ]
  }
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "slow-thinking-in-fast-systems",
    title: "Slow Thinking in Fast Systems",
    excerpt:
      "A meditation on attention, automation, and why serious work still needs unhurried interior space.",
    category: "Essays",
    readTime: "8 min read",
    publishedAt: "June 2, 2026",
    publishedDate: "2026-06-02",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    tags: ["Attention", "Technology", "Philosophy"],
    featured: true,
    sections: baseSections
  },
  {
    id: "2",
    slug: "notes-on-intellectual-hospitality",
    title: "Notes on Intellectual Hospitality",
    excerpt:
      "What it means to build spaces where difficult ideas can arrive without being immediately consumed.",
    category: "Personal Notes",
    readTime: "5 min read",
    publishedAt: "May 24, 2026",
    publishedDate: "2026-05-24",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop",
    tags: ["Writing", "Culture", "Ideas"],
    sections: baseSections
  },
  {
    id: "3",
    slug: "research-as-daily-practice",
    title: "Research as Daily Practice",
    excerpt:
      "Small systems for reading, note-taking, and returning to unfinished questions.",
    category: "Research",
    readTime: "7 min read",
    publishedAt: "May 18, 2026",
    publishedDate: "2026-05-18",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop",
    tags: ["Research", "Notes", "Books"],
    sections: baseSections
  },
  {
    id: "4",
    slug: "minimal-tools-for-deep-work",
    title: "Minimal Tools for Deep Work",
    excerpt:
      "A practical argument for fewer tools, calmer defaults, and deliberate constraints.",
    category: "Productivity",
    readTime: "6 min read",
    publishedAt: "May 9, 2026",
    publishedDate: "2026-05-09",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1600&auto=format&fit=crop",
    tags: ["Productivity", "Design", "Attention"],
    sections: baseSections
  },
  {
    id: "5",
    slug: "reading-against-the-feed",
    title: "Reading Against the Feed",
    excerpt:
      "Why deliberate reading feels countercultural inside an environment built for endless transition.",
    category: "Culture",
    readTime: "9 min read",
    publishedAt: "April 30, 2026",
    publishedDate: "2026-04-30",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop",
    tags: ["Culture", "Books", "Attention"],
    sections: baseSections
  },
  {
    id: "6",
    slug: "designing-for-seriousness",
    title: "Designing for Seriousness",
    excerpt:
      "A note on visual restraint, typography, and interfaces that invite sustained thought.",
    category: "Design",
    readTime: "6 min read",
    publishedAt: "April 21, 2026",
    publishedDate: "2026-04-21",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop",
    tags: ["Design", "Typography", "Writing"],
    sections: baseSections
  },
  {
    id: "7",
    slug: "books-that-change-the-room",
    title: "Books That Change the Room",
    excerpt:
      "On texts that do not merely inform, but alter the atmosphere of thinking around them.",
    category: "Books",
    readTime: "5 min read",
    publishedAt: "April 11, 2026",
    publishedDate: "2026-04-11",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600&auto=format&fit=crop",
    tags: ["Books", "Ideas", "Culture"],
    sections: baseSections
  },
  {
    id: "8",
    slug: "philosophy-after-notification",
    title: "Philosophy After Notification",
    excerpt:
      "Can reflection survive in an environment that keeps asking for immediate response?",
    category: "Philosophy",
    readTime: "10 min read",
    publishedAt: "March 28, 2026",
    publishedDate: "2026-03-28",
    author: "Dũng Nguyễn Việt",
    authorAvatar,
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    tags: ["Philosophy", "Technology", "Attention"],
    sections: baseSections
  }
];

export function getAllArticles() {
  return [...articles].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export function getTopics() {
  return topics;
}

export function getFeaturedArticle() {
  return articles.find((article) => article.featured) ?? articles[0];
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticleUrl(slug: string) {
  return `${siteConfig.url}/posts/${slug}`;
}

export function searchArticles(query: string, topic = "All") {
  const normalizedQuery = query.trim().toLowerCase();

  return getAllArticles().filter((article) => {
    const topicMatches =
      topic === "All" ||
      article.category === topic ||
      article.tags.some((tag) => tag.toLowerCase() === topic.toLowerCase());

    if (!topicMatches) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchable = [
      article.title,
      article.excerpt,
      article.category,
      ...article.tags,
      ...article.sections.flatMap((section) => [section.title, ...section.paragraphs])
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function getRelatedArticles(slug: string, limit = 3) {
  const current = getArticleBySlug(slug);

  if (!current) {
    return getAllArticles().slice(0, limit);
  }

  return getAllArticles()
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
