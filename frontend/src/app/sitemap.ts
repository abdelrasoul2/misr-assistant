import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://misr-assistant.vercel.app";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

type Item = { slug: string; updated_at?: string };

async function safeFetch(path: string): Promise<Item[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/sectors`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/offices`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/hotlines`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/assistant`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [services, sectors] = await Promise.all([
    safeFetch("/services?page=1&page_size=100"),
    safeFetch("/sectors?page=1&page_size=100"),
  ]);

  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => s?.slug)
    .map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const sectorRoutes: MetadataRoute.Sitemap = sectors
    .filter((s) => s?.slug)
    .map((s) => ({
      url: `${SITE_URL}/sectors/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...serviceRoutes, ...sectorRoutes];
}