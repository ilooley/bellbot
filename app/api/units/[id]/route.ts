import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

// GET /api/units/[id] - Get a specific unit by ID
export const GET = withAuth(async (req, { userId }, { params }) => {
  try {
    const unitId = params.id
    
    if (!unitId) {
      return NextResponse.json(
        { error: 'Unit ID is required' },
        { status: 400 }
      )
    }
    
    const unit = await prisma.unit.findUnique({
      where: { 
        id: unitId,
        isActive: true
      },
      include: {
        property: {
          select: {
            name: true,
            address: true,
            city: true,
            state: true,
            userId: true
          }
        }
      }
    })
    
    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      )
    }
    
    // Verify that the unit's property belongs to the authenticated user
    if (unit.property.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(unit)
  } catch (error) {
    console.error('Error fetching unit:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unit' },
      { status: 500 }
    )
  }
})

// PATCH /api/units/[id] - Update a specific unit
export const PATCH = withAuth(async (req, { userId }, { params }) => {
  try {
    const unitId = params.id
    const body = await req.json()
    
    if (!unitId) {
      return NextResponse.json(
        { error: 'Unit ID is required' },
        { status: 400 }
      )
    }
    
    // Find the unit to ensure it exists and belongs to the authenticated user
    const existingUnit = await prisma.unit.findUnique({
      where: { 
        id: unitId,
        isActive: true
      },
      include: {
        property: {
          select: {
            userId: true
          }
        }
      }
    })
    
    if (!existingUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      )
    }
    
    // Verify that the unit's property belongs to the authenticated user
    if (existingUnit.property.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Update the unit
    const updatedUnit = await prisma.unit.update({
      where: { id: unitId },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json(updatedUnit)
  } catch (error) {
    console.error('Error updating unit:', error)
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    )
  }
})

// DELETE /api/units/[id] - Delete (or soft-delete) a specific unit
export const DELETE = withAuth(async (req, { userId }, { params }) => {
  try {
    const unitId = params.id
    
    if (!unitId) {
      return NextResponse.json(
        { error: 'Unit ID is required' },
        { status: 400 }
      )
    }
    
    // Find the unit to ensure it exists and belongs to the authenticated user
    const existingUnit = await prisma.unit.findUnique({
      where: { 
        id: unitId
      },
      include: {
        property: {
          select: {
            userId: true
          }
        }
      }
    })
    
    if (!existingUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      )
    }
    
    // Verify that the unit's property belongs to the authenticated user
    if (existingUnit.property.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Perform soft delete by setting isActive to false
    await prisma.unit.update({
      where: { id: unitId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting unit:', error)
    return NextResponse.json(
      { error: 'Failed to delete unit' },
      { status: 500 }
    )
  }
})
