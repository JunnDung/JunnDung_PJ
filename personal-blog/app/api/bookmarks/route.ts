import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: { article: { include: { tags: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ bookmarks });
}
