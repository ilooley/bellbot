"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

type Unit = {
  id: string
  name: string
  unitNumber: string
  floor?: string | null
  bedrooms: number
  bathrooms: number
  squareFeet?: number | null
  maxOccupancy?: number | null
  description?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type Property = {
  name: string
  address: string
  city: string
  state: string
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
const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  
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
              <Button
                variant="destructive"
                onClick={() => {
                  setIsOpen(false)
                  // This is handled by the parent component
                }}
              >
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

export default function UnitsListPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          router.push('/login')
          return
        }
        
        const response = await fetch(`/api/units?propertyId=${propertyId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch units')
        }
        
        const data = await response.json()
        setUnits(data)
        
        if (data.length > 0 && data[0].property) {
          setProperty({
            name: data[0].property.name,
            address: data[0].property.address,
            city: data[0].property.city,
            state: data[0].property.state
          })
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching units:', err)
        setError('Failed to load units. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchUnits()
  }, [propertyId, router])
  
  const handleDeleteUnit = async (unitId: string) => {
    try {
      setDeleteLoading(unitId)
      
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
      
      // Remove the deleted unit from the list
      setUnits(units.filter(unit => unit.id !== unitId))
      setDeleteLoading(null)
    } catch (err) {
      console.error('Error deleting unit:', err)
      setError('Failed to delete unit. Please try again.')
      setDeleteLoading(null)
    }
  }
  
  // Filter units based on search term
  const filteredUnits = units.filter(unit => {
    return (
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.floor && unit.floor.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Units</h1>
          {property && (
            <p className="text-sm text-gray-500">
              {property.name} - {property.address}, {property.city}, {property.state}
            </p>
          )}
        </div>
        <Link href={`/dashboard/properties/${propertyId}/units/new`}>
          <Button className="mt-2 sm:mt-0">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Unit
          </Button>
        </Link>
      </div>
      
      {error && (
        <Alert title="Error" description={error} variant="error" />
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search units..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredUnits.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No units found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm ? 'No units match your search.' : 'This property has no units yet.'}
          </p>
          {!searchTerm && (
            <Link href={`/dashboard/properties/${propertyId}/units/new`}>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Your First Unit
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/dashboard/properties/${propertyId}/units/${unit.id}`} className="hover:underline">
                  <h3 className="font-medium text-lg">{unit.name}</h3>
                </Link>
                <div className="flex space-x-1">
                  <Link href={`/dashboard/properties/${propertyId}/units/${unit.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeleteUnit(unit.id)}
                      disabled={deleteLoading === unit.id}
                    >
                      {deleteLoading === unit.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialog>
                </div>
              </div>
              <div className="text-sm text-gray-500">Unit #{unit.unitNumber}</div>
              {unit.floor && <div className="text-sm text-gray-500">Floor: {unit.floor}</div>}
              <div className="text-sm text-gray-500">
                {unit.bedrooms} BD / {unit.bathrooms} BA
                {unit.squareFeet && ` / ${unit.squareFeet} sq ft`}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
