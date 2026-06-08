import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { searchArticles } from "@/lib/articles";

const searchSchema = z.object({
  q: z.string().max(100).optional().default(""),
  topic: z.string().max(50).optional().default("All"),
  sort: z.enum(["latest", "readTime", "title"]).optional().default("latest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(12)
});

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`search:${ip}`, 60, 60_000);

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many search requests" }, { status: 429 });
  }

  const url = new URL(request.url);
  const parsed = searchSchema.safeParse(Object.fromEntries(url.searchParams));

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }

  const result = await searchArticles(parsed.data);
  return NextResponse.json(result);
}
