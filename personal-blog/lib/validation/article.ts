import { ArticleStatus } from "@prisma/client";
import { z } from "zod";
import { isAllowedImageUrl } from "@/lib/security/urls";

const reservedSlugs = new Set(["admin", "api", "login", "bookmarks", "sitemap", "robots"]);

export const articleIdSchema = z.string().cuid();

export const sectionSchema = z.array(
  z.object({
    id: z.string().min(1).max(80),
    title: z.string().min(1).max(180),
    paragraphs: z.array(z.string().min(1).max(5000)).min(1).max(20)
  })
).min(1).max(20);

export const articleInputSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine((slug) => !reservedSlugs.has(slug), "Reserved slug"),
  excerpt: z.string().min(10).max(500),
  category: z.string().min(2).max(80),
  readTime: z.string().min(2).max(40),
  author: z.string().min(2).max(120),
  authorAvatar: z.string().url().refine(isAllowedImageUrl, "Author avatar host is not allowed"),
  coverImage: z.string().url().refine(isAllowedImageUrl, "Cover image host is not allowed"),
  status: z.nativeEnum(ArticleStatus),
  featured: z.boolean(),
  publishedAt: z.string().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).min(1).max(15),
  sections: sectionSchema
}).refine((data) => !data.publishedAt || !Number.isNaN(new Date(data.publishedAt).getTime()), "Invalid publish date");

export type ArticleInput = z.infer<typeof articleInputSchema>;

export function parseSectionsJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Sections must be valid JSON");
  }
}

export function normalizeTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
}
