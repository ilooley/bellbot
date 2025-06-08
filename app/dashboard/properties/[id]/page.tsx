'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Building, 
  Edit, 
  Trash2, 
  MapPin, 
  Hash,
  CalendarClock,
  Loader2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
// Define Card components inline
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-white shadow rounded-lg ${className || ''}`}>{children}</div>
)

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 ${className || ''}`}>{children}</div>
)

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`text-lg font-medium ${className || ''}`}>{children}</h3>
)

const CardDescription = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className || ''}`}>{children}</p>
)

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
)

// Define AlertDialog components inline
const AlertDialog = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
)

const AlertDialogTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) => (
  <div>{children}</div>
)

const AlertDialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">{children}</div>
  </div>
)

const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
)

const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold">{children}</h2>
)

const AlertDialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 mt-2">{children}</p>
)

const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end space-x-2 mt-6">{children}</div>
)

const AlertDialogCancel = ({ children }: { children: React.ReactNode }) => (
  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">{children}</button>
)

const AlertDialogAction = ({ className, onClick, disabled, children }: { className?: string, onClick?: () => void, disabled?: boolean, children: React.ReactNode }) => (
  <button 
    className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${className || ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

// Property data from API
type Property = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  units?: number
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/properties/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Property not found')
          } else {
            throw new Error('Failed to fetch property')
          }
          return
        }
        
        const propertyData = await response.json()
        setProperty(propertyData)
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Failed to load property details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const handleDeleteProperty = async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      
      // Navigate back to properties list after successful deletion
      router.push('/dashboard/properties')
      router.refresh()
    } catch (err) {
      console.error('Error deleting property:', err)
      setError('Failed to delete property')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              {error || 'Property not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/properties')}>
              Return to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/properties/${params.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  property and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProperty}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-700">
                  {property.address}<br />
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Building className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Units</p>
                <p className="text-gray-700">{property.units}</p>
              </div>
            </div>
            
            {property.description && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Property ID</p>
                <p className="text-gray-700">{property.id}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <CalendarClock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Added on</p>
                <p className="text-gray-700">
                  {new Date(property.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
