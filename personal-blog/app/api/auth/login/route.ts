import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyLogin } from "@/lib/auth";
import { safeAuditLog } from "@/lib/audit";
import { limitLogin, rateLimitResponse } from "@/lib/rate-limit";
import { assertSameOriginRequest } from "@/lib/security/request";

const loginSchema = z.object({
  email: z.string().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(1024)
});

export async function POST(request: Request) {
  const originError = assertSameOriginRequest(request);
  if (originError) return originError;

  const json = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login request" }, { status: 400 });
  }

  const limit = limitLogin(request, parsed.data.email);
  if (!limit.allowed) return rateLimitResponse(limit.resetAt);

  const user = await verifyLogin(parsed.data.email, parsed.data.password);

  if (!user) {
    await safeAuditLog({ action: "auth.login.failure", target: parsed.data.email });
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);
  await safeAuditLog({ actorId: user.id, action: "auth.login.success", target: user.id });

  return NextResponse.json({ ok: true, role: user.role });
}
