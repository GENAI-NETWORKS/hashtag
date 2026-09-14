import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/cart/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (quantity < 1) {
      return NextResponse.json({ success: false, error: 'Quantity must be at least 1' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parseInt(id), userId: payload.userId },
    });

    if (!cartItem) {
      return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: { product: true, variant: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[CART UPDATE]', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parseInt(id), userId: payload.userId },
    });

    if (!cartItem) {
      return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: cartItem.id } });

    return NextResponse.json({ success: true, message: 'Item removed' });
  } catch (error) {
    console.error('[CART DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to remove item' }, { status: 500 });
  }
}
