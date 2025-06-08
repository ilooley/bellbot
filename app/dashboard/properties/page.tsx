'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Building, MoreHorizontal, Eye, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react'

// UI Component imports
const Card = ({ className, children, key }: { className?: string, children: React.ReactNode, key?: string }) => (
  <div className={`bg-white shadow rounded-lg ${className || ''}`} key={key}>{children}</div>
)

const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block text-left">{children}</div>
)

const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) => (
  <div>{children}</div>
)

const DropdownMenuContent = ({ align, children }: { align?: string, children: React.ReactNode }) => (
  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">{children}</div>
)

const DropdownMenuItem = ({ className, onClick, onSelect, children }: { className?: string, onClick?: () => void, onSelect?: (e: Event) => void, children: React.ReactNode }) => (
  <button 
    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${className || ''}`}
    onClick={onClick}
  >
    {children}
  </button>
)

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

const AlertDialogAction = ({ className, onClick, children }: { className?: string, onClick?: () => void, children: React.ReactNode }) => (
  <button 
    className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${className || ''}`}
    onClick={onClick}
  >
    {children}
  </button>
)

// Define the property type
type Property = {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  units?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      
      try {
        setIsLoading(true)
        const response = await fetch('/api/properties', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        
        const data = await response.json()
        setProperties(data)
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError('Failed to load properties. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProperties()
  }, [router])
  
  // Handle property deletion
  const handleDeleteProperty = async (id: string) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) return
    
    setIsDeleting(true)
    setPropertyToDelete(id)
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      
      // Remove the deleted property from the list
      setProperties(properties.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting property:', err)
      setError('Failed to delete property. Please try again.')
    } finally {
      setIsDeleting(false)
      setPropertyToDelete(null)
    }
  }
  
  // Filter properties based on search query
  const filteredProperties = properties.filter(
    property => 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="mt-4 text-gray-500">Loading properties...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
        <h3 className="mt-4 text-lg font-medium text-red-800">Error Loading Properties</h3>
        <p className="mt-2 text-red-600">{error}</p>
        <Button 
          className="mt-4"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
        <Button onClick={() => router.push('/dashboard/properties/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          className="pl-10" 
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No properties found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery ? 'Try adjusting your search query' : 'Add your first property to get started'}
          </p>
          {!searchQuery && (
            <Button 
              className="mt-4"
              onClick={() => router.push('/dashboard/properties/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{property.name}</h3>
                    <p className="text-gray-500 mt-1 text-sm">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </p>
                    {property.units && (
                      <div className="flex items-center mt-2">
                        <Building className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">{property.units} units</span>
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/properties/${property.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-red-600" onSelect={(e: Event) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              property and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeleteProperty(property.id)}
                            >
                              {isDeleting && propertyToDelete === property.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="px-6 py-2 bg-gray-50 border-t flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600"
                  onClick={() => router.push(`/dashboard/properties/${property.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
