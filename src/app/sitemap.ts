import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic'; // Never statically generate - always run at request time

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hashtagprints.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Only fetch DB routes when database is available
  if (!process.env.DATABASE_URL) {
    return staticRoutes;
  }

  try {
    const { prisma } = await import('@/lib/prisma');

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/products?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    // Return static routes if DB is unavailable during build
    return staticRoutes;
  }
}
