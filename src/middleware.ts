import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

// Danh sách các route không cần yêu cầu đăng nhập
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/refresh'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra nếu route hiện tại là public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/images/') 
  );

  // Lấy token từ cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Kiểm tra tính hợp lệ của token
  // verifyJwt sẽ check cả signature tự động! Thách ai sửa mà qua lưới lọc này.
  const payload = accessToken ? await verifyJwt(accessToken) : null;
  const valid = !!payload;

  // Nếu người dùng chưa đăng nhập hoặc token sai/hết hạn và cố truy cập route bảo vệ
  if (!valid && !isPublicRoute) {
    // Nếu là API request thì trả về 401
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
    // Ngược lại redirect về trang login
    const url = new URL('/login', request.url);
    const response = NextResponse.redirect(url);
    // Xóa cookie nếu nó sai/hết hạn để dọn dẹp
    if (accessToken) {
      response.cookies.delete('accessToken');
    }
    return response;
  }

  // Nếu người dùng đã đăng nhập với token hợp lệ nhưng truy cập trang login
  if (valid && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Xác định các route middleware sẽ chạy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
