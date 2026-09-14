export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('hashtag_auth')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { roleType, gender, source } = body;

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        roleType,
        gender,
        source,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        roleType: true,
        gender: true,
        source: true,
        onboardingCompleted: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      { success: true, data: { user: updatedUser }, message: 'Onboarding completed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH ONBOARDING]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save onboarding details' },
      { status: 500 }
    );
  }
}
