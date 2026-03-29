import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      
      const accessToken = await signJwt({
        id: 'user_123',
        email,
        name: 'Admin User',
      }, '30m'); // Hết hạn trong 30 phút

      const refreshToken = await signJwt({
        id: 'user_123',
        type: 'refresh',
      }, '30d'); // Hết hạn trong 30 ngày

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
