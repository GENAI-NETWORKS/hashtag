export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/products
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
          _count: { select: { variants: true, orderItems: true } },
        },
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({ success: true, data: products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('[ADMIN PRODUCTS GET]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { categoryId, name, slug, description, basePrice, images, tags, isFeatured, isBestseller, metaTitle, metaDesc } = body;

    if (!categoryId || !name || !slug || !description || !basePrice) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        categoryId: parseInt(categoryId),
        name,
        slug,
        description,
        basePrice: parseFloat(basePrice),
        images: images || [],
        tags: tags || [],
        isFeatured: isFeatured || false,
        isBestseller: isBestseller || false,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A product with this slug already exists' }, { status: 409 });
    }
    console.error('[ADMIN PRODUCTS POST]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
