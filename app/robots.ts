import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = settings.site_url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
