export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/coupons/validate?code=XXX&subtotal=999
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.toUpperCase();
    const subtotal = parseFloat(searchParams.get('subtotal') || '0');

    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    if (subtotal < Number(coupon.minOrder)) {
      return NextResponse.json({
        success: false,
        error: `Minimum order amount of â‚¹${Number(coupon.minOrder)} required for this coupon`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.round(subtotal * (Number(coupon.value) / 100));
    } else {
      discount = Number(coupon.value);
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        discount,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('[COUPON VALIDATE]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
