export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function requireAuth(req: NextRequest) {
  const payload = getAuthFromRequest(req);
  if (!payload) {
    throw new Error('UNAUTHORIZED');
  }
  return payload;
}

// GET /api/cart
export async function GET(req: NextRequest) {
  try {
    const payload = requireAuth(req);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: payload.userId },
      include: {
        product: { include: { category: { select: { name: true, slug: true } } } },
        variant: true,
        customization: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: cartItems });
  } catch (error: unknown) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    console.error('[CART GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart - Add item
export async function POST(req: NextRequest) {
  try {
    const payload = requireAuth(req);
    const body = await req.json();
    const { productId, variantId, customizationId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    // Check if item already exists
    const existing = await prisma.cartItem.findFirst({
      where: { userId: payload.userId, productId, variantId: variantId || null, customizationId: customizationId || null },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: {
          product: true,
          variant: true,
          customization: true,
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: payload.userId,
        productId,
        variantId: variantId || null,
        customizationId: customizationId || null,
        quantity,
      },
      include: {
        product: true,
        variant: true,
        customization: true,
      },
    });

    return NextResponse.json({ success: true, data: cartItem }, { status: 201 });
  } catch (error: unknown) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    console.error('[CART ADD]', error);
    return NextResponse.json({ success: false, error: 'Failed to add item' }, { status: 500 });
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(req: NextRequest) {
  try {
    const payload = requireAuth(req);
    await prisma.cartItem.deleteMany({ where: { userId: payload.userId } });
    return NextResponse.json({ success: true, message: 'Cart cleared' });
  } catch (error: unknown) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Failed to clear cart' }, { status: 500 });
  }
}
