import { prisma } from "@/lib/prisma";

type AuditInput = {
  actorId?: string | null;
  action: string;
  target: string;
  metadata?: Record<string, unknown>;
};

function sanitize(metadata: Record<string, unknown> | undefined) {
  if (!metadata) return undefined;

  const blocked = new Set(["password", "token", "cookie", "authorization", "session"]);
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !blocked.has(key.toLowerCase()))
  );
}

export async function auditLog({ actorId, action, target, metadata }: AuditInput) {
  await prisma.auditLog.create({
    data: {
      actorId: actorId ?? null,
      action,
      target,
      metadata: sanitize(metadata)
    }
  });
}

export async function safeAuditLog(input: AuditInput) {
  try {
    await auditLog(input);
  } catch (error) {
    console.error("Audit log failed", error);
  }
}
