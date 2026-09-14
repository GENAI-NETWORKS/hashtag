import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/addresses
export async function POST(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, line1, line2, city, state, pincode, isDefault } = body;

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ success: false, error: 'All required fields must be provided' }, { status: 400 });
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: payload.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check for exact duplicate to prevent spamming identical addresses
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: payload.userId,
        name,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
      },
    });

    if (existingAddress) {
      if (isDefault && !existingAddress.isDefault) {
        await prisma.address.update({
          where: { id: existingAddress.id },
          data: { isDefault: true },
        });
        existingAddress.isDefault = true;
      }
      return NextResponse.json({ success: true, data: existingAddress }, { status: 200 });
    }

    const address = await prisma.address.create({
      data: {
        userId: payload.userId,
        name,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (error) {
    console.error('[ADDRESS CREATE]', error);
    return NextResponse.json({ success: false, error: 'Failed to save address' }, { status: 500 });
  }
}

// GET /api/addresses
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: payload.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error('[ADDRESSES GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch addresses' }, { status: 500 });
  }
}
