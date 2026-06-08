import { NextResponse } from "next/server";

const MAX_BUCKETS = 10_000;

type Bucket = {
  count: number;
  resetAt: number;
  touchedAt: number;
};

type LimitOptions = {
  limit: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

function cleanup(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt < now) buckets.delete(key);
  }

  if (buckets.size <= MAX_BUCKETS) return;

  const oldest = [...buckets.entries()].sort((a, b) => a[1].touchedAt - b[1].touchedAt);
  for (const [key] of oldest.slice(0, buckets.size - MAX_BUCKETS)) {
    buckets.delete(key);
  }
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(key: string, { limit, windowMs }: LimitOptions) {
  const now = Date.now();
  cleanup(now);
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const next = { count: 1, resetAt: now + windowMs, touchedAt: now };
    buckets.set(key, next);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  bucket.touchedAt = now;

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function limitLogin(request: Request, email: string) {
  const ip = getClientIp(request);
  return rateLimit(`login:${ip}:${email.toLowerCase()}`, { limit: 5, windowMs: 10 * 60 * 1000 });
}

export function limitNewsletter(request: Request, email: string) {
  const ip = getClientIp(request);
  return rateLimit(`newsletter:${ip}:${email.toLowerCase()}`, { limit: 5, windowMs: 60 * 60 * 1000 });
}

export function limitSearch(request: Request) {
  return rateLimit(`search:${getClientIp(request)}`, { limit: 60, windowMs: 60_000 });
}

export function limitBookmark(request: Request, userId: string) {
  return rateLimit(`bookmark:${userId}:${getClientIp(request)}`, { limit: 60, windowMs: 60_000 });
}
