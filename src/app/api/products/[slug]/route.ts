import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: { where: { isActive: true } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('[PRODUCT DETAIL]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}
