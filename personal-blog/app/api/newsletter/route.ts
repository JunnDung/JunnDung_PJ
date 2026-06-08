import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { limitNewsletter, rateLimitResponse } from "@/lib/rate-limit";
import { assertSameOriginRequest } from "@/lib/security/request";

const newsletterSchema = z.object({
  email: z.string().email().max(254).transform((value) => value.toLowerCase()),
  name: z.string().max(120).optional(),
  website: z.string().max(200).optional()
});

export async function POST(request: Request) {
  const originError = assertSameOriginRequest(request);
  if (originError) return originError;

  const json = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const limit = limitNewsletter(request, parsed.data.email);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {
      name: parsed.data.name,
      unsubscribedAt: null
    },
    create: {
      email: parsed.data.email,
      name: parsed.data.name
    }
  });

  return NextResponse.json({ ok: true });
}
