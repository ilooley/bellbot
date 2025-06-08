import * as jose from 'jose';
import bcrypt from 'bcryptjs';

// Helper to get the secret key as Uint8Array
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[AuthLib] JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET environment variable is not set!');
  }
  return new TextEncoder().encode(secret);
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10); // Standard salt rounds is 10
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export interface TokenPayloadInternal extends jose.JWTPayload {
  userId: string;
}

export const generateToken = async (userId: string): Promise<string> => {
  const secretKey = getSecretKey();
  const payload: TokenPayloadInternal = { userId };
  console.log(`[generateToken] JWT_SECRET (first 5 chars): ${process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) : 'UNDEFINED'}`);

  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Set expiration time (e.g., 1 day)
    .sign(secretKey);
};

export async function verifyToken(token: string): Promise<TokenPayloadInternal | null> {
  const secretKey = getSecretKey();
  console.log(`[verifyToken] JWT_SECRET (first 5 chars): ${process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) : 'UNDEFINED'}`);

  if (!token) {
    console.log('[verifyToken] No token provided.');
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify<TokenPayloadInternal>(token, secretKey, {
      algorithms: ['HS256'], // Specify the algorithm(s)
    });
    console.log('[verifyToken] Token decoded successfully:', payload);
    return payload;
  } catch (error: any) {
    console.error('[verifyToken] Error verifying token:', error.name, error.message);
    // Log more details if available
    if (error.code) {
      console.error(`[verifyToken] Error code: ${error.code}`);
    }
    return null;
  }
}
