import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const TAX_RATE = 0.18;

// POST /api/orders - Place order
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, couponCode, notes } = body;

    if (!addressId) {
      return NextResponse.json({ success: false, error: 'Delivery address is required' }, { status: 400 });
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: payload.userId },
    });
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    // Get cart items from request
    const { items } = body;
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsToCreate: any[] = [];

    // Verify items and calculate subtotal securely
    for (const clientItem of items) {
      const product = await prisma.product.findUnique({ where: { id: clientItem.productId } });
      if (!product) continue;
      
      let variant = null;
      if (clientItem.variantId) {
        variant = await prisma.productVariant.findUnique({ where: { id: clientItem.variantId } });
      }

      const unitPrice = Number(product.basePrice) + Number(variant?.priceModifier || 0);
      subtotal += unitPrice * clientItem.quantity;
      
      orderItemsToCreate.push({
        productId: product.id,
        variantId: variant?.id,
        customizationId: clientItem.customizationId,
        quantity: clientItem.quantity,
        unitPrice,
        totalPrice: unitPrice * clientItem.quantity,
      });
    }

    if (orderItemsToCreate.length === 0) {
      return NextResponse.json({ success: false, error: 'Your cart contains invalid items' }, { status: 400 });
    }

    // Apply coupon
    let discount = 0;
    let couponId: number | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode.toUpperCase(),
          isActive: true,
          AND: [
            { OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
            { OR: [{ maxUses: null }, { maxUses: { gt: prisma.coupon.fields.usedCount } }] },
          ],
        },
      });

      if (coupon && subtotal >= Number(coupon.minOrder)) {
        couponId = coupon.id;
        if (coupon.type === 'PERCENTAGE') {
          discount = Math.round(subtotal * (Number(coupon.value) / 100));
        } else {
          discount = Number(coupon.value);
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * TAX_RATE);
    const total = taxableAmount + tax;

    // Estimate delivery (3 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: payload.userId,
          addressId,
          couponId,
          subtotal,
          discount,
          tax,
          total,
          notes,
          estimatedDelivery,
          status: 'PENDING',
          items: {
            create: orderItemsToCreate,
          },
          statusHistory: {
            create: [{ status: 'PENDING', note: 'Order placed successfully' }],
          },
        },
        include: {
          items: { include: { product: true, variant: true } },
          address: true,
          statusHistory: true,
        },
      });

      // We do not delete from cartItem table since we use local storage,
      // but if the user had any, we can clear them just in case.
      await tx.cartItem.deleteMany({ where: { userId: payload.userId } });

      return newOrder;
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('[ORDER CREATE]', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}

// GET /api/orders - List user's orders
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: {
        items: { include: { product: { select: { name: true, images: true } } } },
        address: { select: { city: true, pincode: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[ORDERS LIST]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
