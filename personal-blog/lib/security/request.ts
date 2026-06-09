import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { trustedOrigins } from "@/lib/env";

function normalizeOrigin(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return null;
  }
}

function isSameSite(origin: string | null, request: Request) {
  if (!origin) return false;
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    const url = new URL(`https://${host}`);
    return url.origin === normalizedOrigin;
  } catch {
    return false;
  }
}

export function isTrustedOrigin(origin: string | null) {
  const normalized = normalizeOrigin(origin);
  return Boolean(normalized && trustedOrigins().includes(normalized));
}

export function assertSameOriginRequest(request: Request) {
  const method = request.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  const origin = request.headers.get("origin");

  if (isTrustedOrigin(origin) || isSameSite(origin, request)) {
    return null;
  }

  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}

export async function assertSameOriginAction() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (isTrustedOrigin(origin)) return;

  if (!origin) {
    throw new Error("Forbidden origin");
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) {
    throw new Error("Forbidden origin");
  }

  const host = headerStore.get("host");
  if (!host) {
    throw new Error("Forbidden origin");
  }

  try {
    const url = new URL(`https://${host}`);
    if (url.origin !== normalizedOrigin) {
      throw new Error("Forbidden origin");
    }
  } catch (err) {
    if (err instanceof Error && err.message === "Forbidden origin") throw err;
    throw new Error("Forbidden origin");
  }
}
