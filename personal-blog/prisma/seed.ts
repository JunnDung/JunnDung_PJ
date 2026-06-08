import bcrypt from "bcryptjs";
import { PrismaClient, ArticleStatus, Role } from "@prisma/client";
import { articles } from "../data/articles";

const prisma = new PrismaClient();

function buildSearchText(article: (typeof articles)[number]) {
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

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-now";

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail.toLowerCase(),
      name: "Admin",
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(adminPassword, 12)
    }
  });

  for (const article of articles) {
    for (const tag of article.tags) {
      await prisma.tag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag }
      });
    }

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        publishedAt: new Date(article.publishedDate),
        author: article.author,
        authorAvatar: article.authorAvatar,
        coverImage: article.coverImage,
        featured: article.featured ?? false,
        status: ArticleStatus.PUBLISHED,
        sections: article.sections,
        searchText: buildSearchText(article),
        tags: {
          set: [],
          connect: article.tags.map((tag) => ({ name: tag }))
        }
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        publishedAt: new Date(article.publishedDate),
        author: article.author,
        authorAvatar: article.authorAvatar,
        coverImage: article.coverImage,
        featured: article.featured ?? false,
        status: ArticleStatus.PUBLISHED,
        sections: article.sections,
        searchText: buildSearchText(article),
        tags: {
          connect: article.tags.map((tag) => ({ name: tag }))
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
