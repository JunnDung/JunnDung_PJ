import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

async function getUserOrUnauthorized() {
  const user = await getCurrentUser();
  return user;
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await getUserOrUnauthorized();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`bookmark:${user.id}:${getClientIp(request)}`, 60, 60_000);

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many bookmark requests" }, { status: 429 });
  }

  const { articleId } = await params;
  await prisma.bookmark.upsert({
    where: { userId_articleId: { userId: user.id, articleId } },
    update: {},
    create: { userId: user.id, articleId }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const user = await getUserOrUnauthorized();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`bookmark:${user.id}:${getClientIp(request)}`, 60, 60_000);

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many bookmark requests" }, { status: 429 });
  }

  const { articleId } = await params;
  await prisma.bookmark.deleteMany({ where: { userId: user.id, articleId } });

  return NextResponse.json({ ok: true });
}
