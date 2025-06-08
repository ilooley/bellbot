import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { generateToken } from '@/lib/auth'; // generateToken expects userId (string)

const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password cannot be empty'),
});

export async function POST(request: NextRequest) {
  console.log('[API /auth/login] Received request');
  try {
    const body = await request.json();
    console.log('[API /auth/login] Request body:', body);

    const validation = loginUserSchema.safeParse(body);

    if (!validation.success) {
      console.log('[API /auth/login] Validation failed:', validation.error.flatten().fieldErrors);
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;
    console.log(`[API /auth/login] Attempting login for email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[API /auth/login] User not found for email: ${email}`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Generic message
    }
    console.log(`[API /auth/login] User found: ${user.id}`);

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      console.log(`[API /auth/login] Password mismatch for user: ${user.id}`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Generic message
    }
    console.log(`[API /auth/login] Password matched for user: ${user.id}`);

    // Generate token with user.id    // Generate JWT
    const secretForTokenGeneration = process.env.JWT_SECRET;
    console.log(`[API /auth/login] JWT_SECRET for generation (first 5 chars): ${secretForTokenGeneration ? secretForTokenGeneration.substring(0, 5) : 'UNDEFINED'}`);
    if (!secretForTokenGeneration) {
      console.error('[API /auth/login] JWT_SECRET is not defined during token generation!');
      // Potentially return a 500 error here as this is a server configuration issue
    }
    const token = await generateToken(user.id);
    console.log(`[API /auth/login] Token generated for user: ${user.id}, Token: ${token}`);

    // Return only necessary user info, excluding password
    const { hashedPassword, ...userToReturn } = user;

    const responsePayload = {
      message: 'Login successful',
      token,
      user: {
        id: userToReturn.id,
        name: userToReturn.name ?? '', // Provide empty string if name is null
        email: userToReturn.email,
        // Add any other fields from User model that are safe and needed by the client
      },
    };
    console.log('[API /auth/login] Sending success response:', responsePayload);
    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error('[API /auth/login] Internal server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
