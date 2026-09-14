export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'hashtag_auth';

// POST /api/auth/logout
export async function POST() {
  return NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    {
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
      },
    }
  );
}
