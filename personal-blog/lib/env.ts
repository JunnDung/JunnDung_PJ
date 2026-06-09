import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  AUTH_SECRET: z.string().optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  IMAGE_ALLOWED_HOSTS: z.string().optional()
});

const FALLBACK_URL = "http://localhost:3000";

function safeUrl(input: string): URL {
  if (!input || typeof input !== "string") {
    return new URL(FALLBACK_URL);
  }
  try {
    return new URL(input);
  } catch {
    return new URL(FALLBACK_URL);
  }
}

const _parsed = envSchema.safeParse(process.env);

function _val<T>(key: keyof z.infer<typeof envSchema>): T {
  if (!_parsed.success) {
    if (typeof window === "undefined") {
      throw new Error(
        `Missing required environment variable: ${_parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`
      );
    }
    return undefined as T;
  }
  return _parsed.data[key] as T;
}

export const env = {
  get NODE_ENV() { return _val<string>("NODE_ENV"); },
  get DATABASE_URL() { return _val<string | undefined>("DATABASE_URL"); },
  get DIRECT_URL() { return _val<string | undefined>("DIRECT_URL"); },
  get NEXT_PUBLIC_SITE_URL() { return _val<string>("NEXT_PUBLIC_SITE_URL"); },
  get AUTH_SECRET() { return _val<string | undefined>("AUTH_SECRET"); },
  get TRUSTED_ORIGINS() { return _val<string | undefined>("TRUSTED_ORIGINS"); },
  get IMAGE_ALLOWED_HOSTS() { return _val<string | undefined>("IMAGE_ALLOWED_HOSTS"); }
};

export const siteUrl = () => safeUrl(env.NEXT_PUBLIC_SITE_URL);
export const isLocalSite = () => {
  const u = siteUrl();
  return u.hostname === "localhost" || u.hostname === "127.0.0.1";
};

export const trustedOrigins = () =>
  Array.from(
    new Set([
      env.NEXT_PUBLIC_SITE_URL,
      ...(env.TRUSTED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? [])
    ])
  );

export const allowedImageHosts = () =>
  Array.from(
    new Set([
      "images.unsplash.com",
      ...(env.IMAGE_ALLOWED_HOSTS?.split(",").map((h) => h.trim()).filter(Boolean) ?? [])
    ])
  );

export function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
