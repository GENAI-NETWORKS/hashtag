export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function requireAdmin(req: NextRequest) {
  const payload = getAuthFromRequest(req);
  if (!payload || payload.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return payload;
}

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: true,
          items: { include: { product: { select: { name: true, images: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: orders, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (e: unknown) {
    if ((e as Error).message === 'FORBIDDEN') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
