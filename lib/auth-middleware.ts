import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth' // Assumes verifyToken returns { userId: string } | null

// This is a helper function, not the main Next.js middleware.
// It's designed to be called by API route wrappers or other middleware.
// It expects the token to be in the 'Authorization: Bearer <token>' header.
export async function authMiddleware(request: NextRequest): Promise<NextResponse | string> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const payload = await verifyToken(token); // verifyToken from lib/auth.ts returns { userId: string } | null
  if (!payload || !payload.userId) { // Ensure payload and payload.userId exist
    return NextResponse.json({ error: 'Invalid or malformed token' }, { status: 401 });
  }
  
  return payload.userId; // Returns userId string if token is valid
}

// This HOF uses the authMiddleware helper above for API routes.
export function withAuth(handler: (req: NextRequest, contextWithUserId: { params?: any; userId: string }) => Promise<NextResponse | Response>) {
  return async (request: NextRequest, context?: { params?: any }) => {
    const userIdOrErrorResponse = await authMiddleware(request); // Calls the helper

    if (userIdOrErrorResponse instanceof NextResponse) { // Check if it's an error response
        return userIdOrErrorResponse; // Return the error response (e.g., 401 JSON)
    }
    
    // If it's not an error response, it's the userId string
    const userId = userIdOrErrorResponse;
    // Call the original handler with the userId injected into the context
    return handler(request, { ...context, userId });
  };
}
