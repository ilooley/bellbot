"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Pencil1Icon, TrashIcon, ArrowLeftIcon } from '@radix-ui/react-icons'

type Unit = {
  id: string
  propertyId: string
  name: string
  unitNumber: string
  floor?: string | null
  bedrooms: number
  bathrooms: number
  squareFeet?: number | null
  maxOccupancy?: number | null
  description?: string | null
  accessInstructions?: string | null
  lockboxCode?: string | null
  wifiName?: string | null
  wifiPassword?: string | null
  specialNotes?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  property?: {
    name: string
    address: string
    city: string
    state: string
  }
}

// Inline Card component
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Inline Button component
const Button = ({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  ...props
}: {
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
  [key: string]: any
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary'
  }
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10'
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Dialog components for delete confirmation
const AlertDialog = ({ children, onDelete }: { children: React.ReactNode, onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleDelete = () => {
    setIsOpen(false)
    onDelete()
  }
  
  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone. This will permanently delete the unit.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Inline Alert component
const Alert = ({ title, description, variant = 'error', className = '' }: { title: string; description: string; variant?: 'error' | 'warning' | 'info'; className?: string }) => {
  const variantStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  return (
    <div className={`p-4 rounded-md border mb-4 ${variantStyles[variant]} ${className}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm mt-1">{description}</p>
    </div>
  )
}

export default function UnitDetailPage() {
  const [unit, setUnit] = useState<Unit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  const unitId = params.unitId as string
  
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          router.push('/login')
          return
        }
        
        const response = await fetch(`/api/units/${unitId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch unit details')
        }
        
        const data = await response.json()
        setUnit(data)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching unit details:', err)
        setError('Failed to load unit details. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchUnitDetails()
  }, [unitId, router])
  
  const handleDeleteUnit = async () => {
    try {
      setDeleteLoading(true)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }
      
      const response = await fetch(`/api/units/${unitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete unit')
      }
      
      // Navigate back to the units list after deletion
      router.push(`/dashboard/properties/${propertyId}/units`)
    } catch (err) {
      console.error('Error deleting unit:', err)
      setError('Failed to delete unit. Please try again.')
      setDeleteLoading(false)
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Section renderer for property details
  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-2 text-gray-700">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )

  // Detail item renderer
  const DetailItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    if (value === null || value === undefined || value === '') return null
    
    return (
      <div className="flex">
        <span className="text-sm text-gray-500 w-36">{label}:</span>
        <span className="text-sm">{value}</span>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => router.push(`/dashboard/properties/${propertyId}/units`)}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Units
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold mb-1">
            {isLoading ? 'Loading...' : unit?.name}
          </h1>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Link href={`/dashboard/properties/${propertyId}/units/${unitId}/edit`}>
              <Button variant="outline" className="flex items-center">
                <Pencil1Icon className="mr-2 h-4 w-4" />
                Edit Unit
              </Button>
            </Link>
            
            <AlertDialog onDelete={handleDeleteUnit}>
              <Button
                variant="destructive"
                className="flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <TrashIcon className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </AlertDialog>
          </div>
        </div>
        
        {error && <Alert title="Error" description={error} variant="error" />}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : unit && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Unit Information</h2>
            
            <DetailSection title="Basic Details">
              <DetailItem label="Unit Number" value={unit.unitNumber} />
              {unit.floor && <DetailItem label="Floor" value={unit.floor} />}
              <DetailItem label="Bedrooms" value={unit.bedrooms} />
              <DetailItem label="Bathrooms" value={unit.bathrooms} />
              {unit.squareFeet && <DetailItem label="Square Feet" value={unit.squareFeet} />}
              {unit.maxOccupancy && <DetailItem label="Max Occupancy" value={unit.maxOccupancy} />}
            </DetailSection>
            
            {unit.description && (
              <DetailSection title="Description">
                <p className="text-sm whitespace-pre-wrap">{unit.description}</p>
              </DetailSection>
            )}
            
            <DetailSection title="Access Information">
              {unit.accessInstructions && (
                <DetailItem label="Access Instructions" value={unit.accessInstructions} />
              )}
              {unit.lockboxCode && (
                <DetailItem label="Lockbox Code" value={unit.lockboxCode} />
              )}
            </DetailSection>
            
            <DetailSection title="Network Information">
              {unit.wifiName && (
                <DetailItem label="WiFi Name" value={unit.wifiName} />
              )}
              {unit.wifiPassword && (
                <DetailItem label="WiFi Password" value={unit.wifiPassword} />
              )}
            </DetailSection>
            
            {unit.specialNotes && (
              <DetailSection title="Special Notes">
                <p className="text-sm whitespace-pre-wrap">{unit.specialNotes}</p>
              </DetailSection>
            )}
          </Card>
          
          <div className="col-span-1">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-medium mb-3">Property Information</h3>
              {unit.property && (
                <>
                  <p className="font-medium">{unit.property.name}</p>
                  <p className="text-sm text-gray-500">
                    {unit.property.address}, {unit.property.city}, {unit.property.state}
                  </p>
                </>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <DetailItem label="Created" value={formatDate(unit.createdAt)} />
                <DetailItem label="Last Updated" value={formatDate(unit.updatedAt)} />
              </div>
              
              <div className="mt-4">
                <Link href={`/dashboard/properties/${propertyId}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Property
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
