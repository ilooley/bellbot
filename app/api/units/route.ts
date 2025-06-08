import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

// GET /api/units - Get all units for authenticated user
export const GET = withAuth(async (req, { userId }) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')
    
    // Query to filter units by propertyId and make sure the property belongs to the authenticated user
    const query = propertyId 
      ? {
          where: {
            propertyId,
            property: {
              userId
            },
            isActive: true
          },
          include: {
            property: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        }
      : {
          where: {
            property: {
              userId
            },
            isActive: true
          },
          include: {
            property: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        }
    
    const units = await prisma.unit.findMany(query)
    
    return NextResponse.json(units)
  } catch (error) {
    console.error('Error fetching units:', error)
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    )
  }
})

// POST /api/units - Create a new unit for authenticated user
export const POST = withAuth(async (req, { userId }) => {
  try {
    const body = await req.json()
    const { propertyId, name, unitNumber, floor, bedrooms, bathrooms, squareFeet, maxOccupancy, description, accessInstructions, lockboxCode, wifiName, wifiPassword, specialNotes } = body
    
    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }
    
    if (!name) {
      return NextResponse.json(
        { error: 'Unit name is required' },
        { status: 400 }
      )
    }
    
    if (!unitNumber) {
      return NextResponse.json(
        { error: 'Unit number is required' },
        { status: 400 }
      )
    }
    
    // Verify that the property belongs to the authenticated user
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId
      }
    })
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found or unauthorized' },
        { status: 404 }
      )
    }
    
    // Create the unit
    const unit = await prisma.unit.create({
      data: {
        propertyId,
        name,
        unitNumber,
        floor,
        bedrooms: bedrooms || 1,
        bathrooms: bathrooms || 1,
        squareFeet,
        maxOccupancy,
        description,
        accessInstructions,
        lockboxCode,
        wifiName,
        wifiPassword,
        specialNotes,
        isActive: true
      }
    })
    
    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error('Error creating unit:', error)
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    )
  }
})
