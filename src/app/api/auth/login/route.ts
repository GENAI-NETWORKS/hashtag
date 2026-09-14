import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const COOKIE_NAME = 'hashtag_auth';

function signJWT(payload: object): string {
  // Dynamic import to handle edge runtime
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
}

function createCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
}

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
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
        passwordHash: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated. Contact support.' },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    const token = signJWT({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json(
      { success: true, data: { user: userWithoutPassword }, message: 'Logged in successfully' },
      { status: 200, headers: { 'Set-Cookie': createCookie(token) } }
    );
  } catch (error) {
    console.error('[AUTH LOGIN]', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
