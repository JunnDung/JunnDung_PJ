import { NextResponse } from "next/server";
import { z } from "zod";
import { limitSearch, rateLimitResponse } from "@/lib/rate-limit";
import { searchArticles } from "@/lib/articles";

const searchSchema = z.object({
  q: z.string().max(100).optional().default(""),
  topic: z.string().max(50).optional().default("All"),
  sort: z.enum(["latest", "readTime", "title"]).optional().default("latest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(12)
});

export async function GET(request: Request) {
  const limit = limitSearch(request);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const url = new URL(request.url);
  const parsed = searchSchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }

  const result = await searchArticles(parsed.data);
  return NextResponse.json(result);
}
