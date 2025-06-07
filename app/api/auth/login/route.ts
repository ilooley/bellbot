import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedCredentials = loginUserSchema.safeParse(body);

    if (!parsedCredentials.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: parsedCredentials.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsedCredentials.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (!user.hashedPassword) {
        // This case should ideally not happen if users are always created with a password
        console.error(`User ${email} has no hashed password set.`);
        return NextResponse.json({ message: 'Authentication configuration error for user.' }, { status: 500 });
    }

    const isPasswordValid = await verifyPassword(password, user.hashedPassword);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    // Return token and some user info (excluding sensitive data like hashedPassword)
    const { hashedPassword, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: 'Validation error during login', errors: error.flatten().fieldErrors },
          { status: 400 }
        );
      }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
