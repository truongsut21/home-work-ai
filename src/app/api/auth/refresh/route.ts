import { NextResponse } from 'next/server';

function createMockJwt(payload: any) {
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.mock_signature_123`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Missing Token' }, { status: 401 });
    }

    const now = Math.floor(Date.now() / 1000);
    
    // Tạo cặp token mới
    const newAccessToken = createMockJwt({
      id: 'user_123',
      email: 'admin@admin.com',
      name: 'Admin User',
      exp: now + 30 * 60, // 30 mins
    });

    const newRefreshToken = createMockJwt({
      id: 'user_123',
      type: 'refresh',
      exp: now + 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
