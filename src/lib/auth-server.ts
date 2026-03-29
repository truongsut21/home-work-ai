import { NextRequest } from 'next/server';
import { verifyJwt } from './jwt';

/**
 * Checks if the API request contains a valid Authorization: Bearer <token>
 * Returns the decoded payload if valid, otherwise returns false.
 */
export async function verifyApiAuth(req: NextRequest | Request) {
  const authHeader = req.headers.get('Authorization');
  
  // Lấy token từ header Authorization (Bearer <token>)
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  if (!token && 'cookies' in req) {
    const nextReq = req as NextRequest;
    token = nextReq.cookies.get('accessToken')?.value || null;
  }

  if (!token) return false;
  
  // Xác thực token chính xác bằng jose
  const payload = await verifyJwt(token);
  return payload ? payload : false;
}
