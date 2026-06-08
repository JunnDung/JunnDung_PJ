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
