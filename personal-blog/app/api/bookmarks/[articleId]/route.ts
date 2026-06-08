import { ArticleStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { limitBookmark, rateLimitResponse } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { assertSameOriginRequest } from "@/lib/security/request";

const paramsSchema = z.object({ articleId: z.string().cuid() });

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

async function getUserOrUnauthorized() {
  return getCurrentUser();
}

export async function POST(request: Request, { params }: RouteContext) {
  const originError = assertSameOriginRequest(request);
  if (originError) return originError;

  const user = await getUserOrUnauthorized();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = limitBookmark(request, user.id);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) return NextResponse.json({ error: "Invalid article id" }, { status: 400 });

  const article = await prisma.article.findFirst({
    where: { id: parsed.data.articleId, status: ArticleStatus.PUBLISHED },
    select: { id: true }
  });

  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

  await prisma.bookmark.upsert({
    where: { userId_articleId: { userId: user.id, articleId: article.id } },
    update: {},
    create: { userId: user.id, articleId: article.id }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const originError = assertSameOriginRequest(request);
  if (originError) return originError;

  const user = await getUserOrUnauthorized();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = limitBookmark(request, user.id);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) return NextResponse.json({ error: "Invalid article id" }, { status: 400 });

  await prisma.bookmark.deleteMany({ where: { userId: user.id, articleId: parsed.data.articleId } });

  return NextResponse.json({ ok: true });
}
