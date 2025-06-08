import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Schema for updating property
const updatePropertySchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(5).optional(),
  units: z.number().int().positive().optional(),
  description: z.string().optional(),
  accessInstructions: z.string().optional(),
  lockboxCode: z.string().optional(),
  wifiName: z.string().optional(),
  wifiPassword: z.string().optional(),
  parkingInstructions: z.string().optional(),
  specialNotes: z.string().optional(),
  isActive: z.boolean().optional(),
})

async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  return prisma.user.findUnique({ where: { id: payload.userId } })
}

async function checkPropertyAccess(propertyId: string, userId: string) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      userId: userId
    }
  })
  
  return property !== null
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this property
    const hasAccess = await checkPropertyAccess(params.id, user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this property
    const hasAccess = await checkPropertyAccess(params.id, user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = updatePropertySchema.parse(body)

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this property
    const hasAccess = await checkPropertyAccess(params.id, user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if there are any jobs associated with this property
    const jobsCount = await prisma.job.count({
      where: { propertyId: params.id }
    })

    if (jobsCount > 0) {
      // Instead of hard deletion, mark the property as inactive
      await prisma.property.update({
        where: { id: params.id },
        data: { isActive: false }
      })
      
      return NextResponse.json({ 
        message: 'Property has been marked as inactive because it has associated jobs' 
      })
    }

    // No jobs, can hard delete
    await prisma.property.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Property successfully deleted' 
    })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
