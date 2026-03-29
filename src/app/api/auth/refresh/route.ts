import { NextResponse } from 'next/server';
import { signJwt, verifyJwt } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Missing Token' }, { status: 401 });
    }

    // 💡 Bước cực kỳ quan trọng: Bắt buộc Verify Refresh Token xịn
    const verified = await verifyJwt(refreshToken);
    if (!verified || verified.type !== 'refresh') {
      return NextResponse.json({ message: 'Invalid or Expired Refresh Token' }, { status: 401 });
    }
    
    // Tạo cặp token mới
    const newAccessToken = await signJwt({
      id: verified.id,
      email: verified.email || 'admin@admin.com',
      name: verified.name || 'Admin User',
    }, '30m');

    const newRefreshToken = await signJwt({
      id: verified.id,
      type: 'refresh',
    }, '30d');

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
