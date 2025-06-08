import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth-middleware'; // Using the HOF for route protection

// Define the handler function that `withAuth` will wrap
async function meHandler(request: NextRequest, context: { userId: string }) {
  console.log('[API /auth/me] Received request');
  const { userId } = context; // userId is injected by withAuth
  console.log(`[API /auth/me] User ID from token: ${userId}`);

  try {
    console.log(`[API /auth/me] Fetching user details for ID: ${userId}`);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        // Add any other fields you want to return about the user
        // Ensure not to return sensitive data like hashedPassword
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.log(`[API /auth/me] User not found in database for ID: ${userId}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log(`[API /auth/me] User found in database:`, user);

    // The name property from Prisma can be null. The AuthContext User type expects string | null | undefined.
    // Prisma's `select` already gives us `name: string | null` if it's optional in schema.
    // We'll ensure it's at least `string | null` for the response.
    const userToReturn = {
        ...user,
        name: user.name ?? null, // Explicitly set to null if undefined/null from DB
    };
    console.log('[API /auth/me] Returning user data:', userToReturn);
    return NextResponse.json({ user: userToReturn });

  } catch (error) {
    console.error('[API /auth/me] Internal server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Wrap the handler with `withAuth` to protect the route and inject userId
export const GET = withAuth(meHandler);
