import type { MetadataRoute } from "next";
import { getAllArticles, siteConfig } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    ...getAllArticles().map((article) => ({
      url: `${siteConfig.url}/posts/${article.slug}`,
      lastModified: new Date(article.publishedDate),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
