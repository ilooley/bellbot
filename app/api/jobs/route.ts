import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { verifyToken } from '@/lib/auth'; // Assuming you have a way to get userId from token

// Zod schema for job creation validation
const createJobSchema = z.object({
  propertyId: z.string().min(1, { message: 'Property is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.string().min(1, { message: 'Job type is required' }),
  description: z.string().optional(),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  estimatedHours: z.number().min(0, { message: 'Estimated hours must be positive' }),
  status: z.enum(['pending', 'dispatched', 'accepted', 'in_progress', 'completed', 'canceled', 'problem']).default('pending'), // Aligned with schema comment and default
  estimatedCost: z.number().optional(), // Changed budget to estimatedCost
  // internalNotes removed as it's not in the Job model
  // userId will be extracted from the auth token
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user and get userId
    // This is a placeholder - implement your actual token verification and userId extraction
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    const decodedToken = verifyToken(token);
    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const userId = decodedToken.userId;

    // 2. Parse and validate request body
    const body = await req.json();
    const parsedJob = createJobSchema.safeParse({
      ...body,
      scheduledDate: body.scheduledDate,
      status: body.status || 'pending', // Default status aligned with schema
      estimatedCost: body.estimatedCost ? parseFloat(body.estimatedCost) : undefined, // budget to estimatedCost
      estimatedHours: body.estimatedHours ? parseFloat(body.estimatedHours) : undefined,
    });

    if (!parsedJob.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: parsedJob.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { propertyId, title, type, description, scheduledDate, estimatedHours, status, estimatedCost } = parsedJob.data;

    // 3. Check if the property belongs to the user (important authorization step)
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId: userId,
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found or access denied' },
        { status: 404 }
      );
    }

    // 4. Create the job
    const newJob = await prisma.job.create({
      data: {
        userId,
        propertyId,
        title,
        type,
        description,
        scheduledDate: new Date(scheduledDate),
        estimatedHours,
        status,
        estimatedCost,
        // internalNotes removed
        // Other fields like paymentStatus, providerId can be set later or have defaults
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// TODO: Implement GET request to fetch jobs (with pagination, filtering, etc.)
// export async function GET(req: NextRequest) {
//   // ... logic to fetch jobs ...
// }
