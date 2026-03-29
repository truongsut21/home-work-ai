import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET_KEY || 'my-super-secret-key-for-jwt-2024-xyz-12345';
const key = new TextEncoder().encode(secretKey);

export async function signJwt(payload: any, expiresIn: string | number) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload; // Token xịn, đúng secret, chưa hết hạn
  } catch (error) {
    return null; // Sai mật khẩu, hết hạn, hoặc format lỗi
  }
}
