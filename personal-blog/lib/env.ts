import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(32).optional(),
  TRUSTED_ORIGINS: z.string().optional(),
  IMAGE_ALLOWED_HOSTS: z.string().optional()
});

export const env = envSchema.parse(process.env);

if (env.NODE_ENV === "production" && !env.NEXT_PUBLIC_SITE_URL.startsWith("https://")) {
  throw new Error("NEXT_PUBLIC_SITE_URL must use https:// in production");
}

export const trustedOrigins = Array.from(
  new Set([
    env.NEXT_PUBLIC_SITE_URL,
    ...(env.TRUSTED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [])
  ])
);

export const allowedImageHosts = Array.from(
  new Set([
    "images.unsplash.com",
    ...(env.IMAGE_ALLOWED_HOSTS?.split(",").map((host) => host.trim()).filter(Boolean) ?? [])
  ])
);

export function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
