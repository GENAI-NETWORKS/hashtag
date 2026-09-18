export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const COOKIE_NAME = 'hashtag_auth';

function createCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
}

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: 'Name, email, password, and phone are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone: phone || null },
      select: { id: true, name: true, email: true, phone: true, role: true, roleType: true, gender: true, source: true, onboardingCompleted: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json(
      { success: true, data: { user }, message: 'Account created successfully' },
      { status: 201, headers: { 'Set-Cookie': createCookie(token) } }
    );
  } catch (error) {
    console.error('[AUTH REGISTER]', error);
    return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
