// app/sitemap.ts
import { MetadataRoute } from "next";

export const dynamic = "force-static"; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.taskflow.com";

  const staticPages: MetadataRoute.Sitemap = [
    "",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  return staticPages;
}
