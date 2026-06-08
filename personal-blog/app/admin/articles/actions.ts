"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ArticleSection } from "@/lib/article-types";

const sectionSchema = z.array(
  z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1)
  })
);

const articleSchema = z.object({
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().min(10).max(500),
  category: z.string().min(2).max(80),
  readTime: z.string().min(2).max(40),
  author: z.string().min(2).max(120),
  authorAvatar: z.string().url(),
  coverImage: z.string().url(),
  status: z.nativeEnum(ArticleStatus),
  featured: z.boolean(),
  publishedAt: z.string().optional(),
  tags: z.array(z.string().min(1)).min(1),
  sections: sectionSchema
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const rawSections = String(formData.get("sections") ?? "[]");
  const sections = JSON.parse(rawSections) as ArticleSection[];
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return articleSchema.parse({
    title,
    slug: String(formData.get("slug") || slugify(title)),
    excerpt: String(formData.get("excerpt") ?? ""),
    category: String(formData.get("category") ?? ""),
    readTime: String(formData.get("readTime") ?? ""),
    author: String(formData.get("author") ?? ""),
    authorAvatar: String(formData.get("authorAvatar") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
    featured: formData.get("featured") === "on",
    publishedAt: String(formData.get("publishedAt") ?? ""),
    tags,
    sections
  });
}

function buildSearchText(article: { title: string; excerpt: string; category: string; tags: string[]; sections: ArticleSection[] }) {
  return [
    article.title,
    article.excerpt,
    article.category,
    ...article.tags,
    ...article.sections.flatMap((section) => [section.title, ...section.paragraphs])
  ]
    .join(" ")
    .toLowerCase();
}

async function syncTags(tags: string[]) {
  for (const tag of tags) {
    await prisma.tag.upsert({ where: { name: tag }, update: {}, create: { name: tag } });
  }
}

export async function createArticle(formData: FormData) {
  const admin = await requireAdmin();
  const data = getFormData(formData);
  await syncTags(data.tags);

  await prisma.$transaction(async (tx) => {
    if (data.featured) {
      await tx.article.updateMany({ data: { featured: false } });
    }

    const article = await tx.article.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        readTime: data.readTime,
        author: data.author,
        authorAvatar: data.authorAvatar,
        coverImage: data.coverImage,
        featured: data.featured,
        status: data.status,
        publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date(data.publishedAt || Date.now()) : data.publishedAt ? new Date(data.publishedAt) : null,
        sections: data.sections,
        searchText: buildSearchText(data),
        tags: { connect: data.tags.map((tag) => ({ name: tag })) }
      }
    });

    await tx.auditLog.create({ data: { actorId: admin.id, action: "article.create", target: article.id } });
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const data = getFormData(formData);
  await syncTags(data.tags);

  await prisma.$transaction(async (tx) => {
    if (data.featured) {
      await tx.article.updateMany({ where: { id: { not: id } }, data: { featured: false } });
    }

    await tx.article.update({
      where: { id },
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        readTime: data.readTime,
        author: data.author,
        authorAvatar: data.authorAvatar,
        coverImage: data.coverImage,
        featured: data.featured,
        status: data.status,
        publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date(data.publishedAt || Date.now()) : data.publishedAt ? new Date(data.publishedAt) : null,
        sections: data.sections,
        searchText: buildSearchText(data),
        tags: { set: [], connect: data.tags.map((tag) => ({ name: tag })) }
      }
    });

    await tx.auditLog.create({ data: { actorId: admin.id, action: "article.update", target: id } });
  });

  revalidatePath("/");
  revalidatePath(`/posts/${data.slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/articles");
}

export async function archiveArticle(id: string) {
  const admin = await requireAdmin();
  await prisma.article.update({ where: { id }, data: { status: ArticleStatus.ARCHIVED, featured: false } });
  await prisma.auditLog.create({ data: { actorId: admin.id, action: "article.archive", target: id } });
  revalidatePath("/");
  redirect("/admin/articles");
}
