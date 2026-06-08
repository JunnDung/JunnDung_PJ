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

export function isTrustedOrigin(origin: string | null) {
  const normalized = normalizeOrigin(origin);
  return Boolean(normalized && trustedOrigins.includes(normalized));
}

export function assertSameOriginRequest(request: Request) {
  const method = request.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (isTrustedOrigin(origin) || isTrustedOrigin(referer)) {
    return null;
  }

  return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
}

export async function assertSameOriginAction() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const referer = headerStore.get("referer");

  if (isTrustedOrigin(origin) || isTrustedOrigin(referer)) {
    return;
  }

  throw new Error("Forbidden origin");
}
