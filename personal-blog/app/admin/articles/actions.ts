"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ArticleStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { safeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { assertSameOriginAction } from "@/lib/security/request";
import type { ArticleSection } from "@/lib/article-types";
import {
  articleIdSchema,
  articleInputSchema,
  normalizeTags,
  parseSectionsJson,
  type ArticleInput
} from "@/lib/validation/article";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getFormData(formData: FormData): ArticleInput {
  const title = String(formData.get("title") ?? "");
  const sections = parseSectionsJson(String(formData.get("sections") ?? "[]"));
  const tags = normalizeTags(String(formData.get("tags") ?? "").split(","));

  return articleInputSchema.parse({
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

function toPublishedAt(data: ArticleInput) {
  if (data.status === ArticleStatus.PUBLISHED) {
    return new Date(data.publishedAt || Date.now());
  }

  return data.publishedAt ? new Date(data.publishedAt) : null;
}

export async function createArticle(formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();
  const data = getFormData(formData);

  await prisma.$transaction(async (tx) => {
    const slugConflict = await tx.article.findFirst({
      where: { slug: data.slug },
      select: { id: true }
    });
    if (slugConflict) throw new Error("Slug already in use");

    for (const tag of data.tags) {
      await tx.tag.upsert({ where: { name: tag }, update: {}, create: { name: tag } });
    }

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
        publishedAt: toPublishedAt(data),
        sections: data.sections,
        searchText: buildSearchText(data),
        tags: { connect: data.tags.map((tag) => ({ name: tag })) }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "article.create",
        target: article.id,
        metadata: { slug: article.slug, status: article.status }
      }
    });
  });

  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  await assertSameOriginAction();
  const admin = await requireAdmin();
  const articleId = articleIdSchema.parse(id);
  const data = getFormData(formData);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.article.findUnique({ where: { id: articleId }, select: { id: true } });
    if (!existing) throw new Error("Article not found");

    const slugConflict = await tx.article.findFirst({
      where: { slug: data.slug, id: { not: articleId } },
      select: { id: true }
    });
    if (slugConflict) throw new Error("Slug already in use by another article");

    for (const tag of data.tags) {
      await tx.tag.upsert({ where: { name: tag }, update: {}, create: { name: tag } });
    }

    if (data.featured) {
      await tx.article.updateMany({ where: { id: { not: articleId } }, data: { featured: false } });
    }

    await tx.article.update({
      where: { id: articleId },
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
        publishedAt: toPublishedAt(data),
        sections: data.sections,
        searchText: buildSearchText(data),
        tags: { set: [], connect: data.tags.map((tag) => ({ name: tag })) }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "article.update",
        target: articleId,
        metadata: { slug: data.slug, status: data.status }
      }
    });
  });

  revalidatePath("/");
  revalidatePath(`/posts/${data.slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/articles");
}

export async function archiveArticle(id: string) {
  await assertSameOriginAction();
  const admin = await requireAdmin();
  const articleId = articleIdSchema.parse(id);

  await prisma.article.update({ where: { id: articleId }, data: { status: ArticleStatus.ARCHIVED, featured: false } });
  await safeAuditLog({ actorId: admin.id, action: "article.archive", target: articleId });
  revalidatePath("/");
  redirect("/admin/articles");
}
