import { allowedImageHosts, env } from "@/lib/env";

export function isAllowedImageUrl(value: string) {
  if (value.startsWith("/")) {
    return value.startsWith("/images/") || value.startsWith("/uploads/");
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;
  if (url.href.length > 2000) return false;

  const siteHost = new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
  return url.hostname === siteHost || allowedImageHosts.includes(url.hostname);
}

export function assertAllowedImageUrl(value: string) {
  if (!isAllowedImageUrl(value)) {
    throw new Error("Image URL host is not allowed");
  }

  return value;
}
