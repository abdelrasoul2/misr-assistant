import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://misr-assistant.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sectors`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/offices`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/hotlines`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

    const [servicesRes, sectorsRes] = await Promise.all([
      fetch(`${API_URL}/services?page=1&page_size=100`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/sectors?page=1&page_size=100`, { next: { revalidate: 3600 } }),
    ]);

    const dynamicPages: MetadataRoute.Sitemap = [];

    if (servicesRes.ok) {
      const services = (await servicesRes.json()) as {
        items: { slug: string; updated_at: string }[];
      };
      for (const svc of services.items) {
        dynamicPages.push({
          url: `${BASE_URL}/services/${svc.slug}`,
          lastModified: new Date(svc.updated_at),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    if (sectorsRes.ok) {
      const sectors = (await sectorsRes.json()) as {
        items: { slug: string; updated_at: string }[];
      };
      for (const sec of sectors.items) {
        dynamicPages.push({
          url: `${BASE_URL}/sectors/${sec.slug}`,
          lastModified: new Date(sec.updated_at),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}