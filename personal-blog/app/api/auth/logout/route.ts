import { NextResponse } from "next/server";
import { destroySession, getCurrentUser } from "@/lib/auth";
import { safeAuditLog } from "@/lib/audit";
import { assertSameOriginRequest } from "@/lib/security/request";

export async function POST(request: Request) {
  const originError = assertSameOriginRequest(request);
  if (originError) return originError;

  const user = await getCurrentUser();
  await destroySession();

  if (user) {
    await safeAuditLog({ actorId: user.id, action: "auth.logout", target: user.id });
  }

  return NextResponse.json({ ok: true });
}
