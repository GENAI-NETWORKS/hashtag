import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/auth/me
export async function GET(req: NextRequest) {
  try {
    const payload = getAuthFromRequest(req);
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, roleType: true, gender: true, source: true, onboardingCompleted: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    console.error('[AUTH ME]', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
