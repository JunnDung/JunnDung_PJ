import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(120).optional(),
  website: z.string().max(200).optional()
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);

  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many subscription attempts" }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const email = parsed.data.email.toLowerCase();

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      name: parsed.data.name,
      unsubscribedAt: null
    },
    create: {
      email,
      name: parsed.data.name
    }
  });

  return NextResponse.json({ ok: true });
}
