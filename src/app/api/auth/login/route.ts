import { NextResponse } from 'next/server';

function createMockJwt(payload: any) {
  // Tạo JWT giả (header.payload.signature) để vượt qua jwt-decode trên middleware
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.mock_signature_123`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const now = Math.floor(Date.now() / 1000);
      
      const accessToken = createMockJwt({
        id: 'user_123',
        email,
        name: 'Admin User',
        exp: now + 30 * 60, // 30 mins
      });

      const refreshToken = createMockJwt({
        id: 'user_123',
        type: 'refresh',
        exp: now + 30 * 24 * 60 * 60, // 30 days
      });

      return NextResponse.json({
        accessToken,
        refreshToken,
        user: {
          id: 'user_123',
          email,
          name: 'Admin User',
        }
      });
    }

    return NextResponse.json(
      { message: 'Tài khoản hoặc mật khẩu không chính xác' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi server' },
      { status: 500 }
    );
  }
}
