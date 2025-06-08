'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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

const CardFooter = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 pt-0 border-t ${className || ''}`}>{children}</div>
)

// Define Alert components inline
const Alert = ({ variant, className, children }: { variant?: string, className?: string, children: React.ReactNode }) => (
  <div className={`p-4 rounded-md ${variant === 'destructive' ? 'bg-red-50 text-red-900 border border-red-200' : 'bg-blue-50 text-blue-900'} ${className || ''}`}>{children}</div>
)

const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm">{children}</p>
)

import { ArrowLeft, Loader2 } from 'lucide-react'

// Property type to match API response
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

// Define the form schema
const propertyFormSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  units: z.number().int().positive('Number of units must be a positive number'),
  description: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertyFormSchema>

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      units: 1,
      description: '',
    }
  })

  // Fetch property data on component mount
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
        
        const property: Property = await response.json()
        
        // Reset form with fetched property data
        reset({
          name: property.name,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          units: property.units || 1,
          description: property.description || '',
        })
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Failed to load property details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, reset])

  const onSubmit = async (data: PropertyFormData) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update property')
      }
      
      // Redirect back to property details after successful update
      router.push(`/dashboard/properties/${params.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error updating property:', err)
      setError('Failed to update property. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

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
        <h1 className="text-2xl font-bold tracking-tight">Edit Property</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>
            Update the details of your property.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input 
                id="name" 
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                {...register('address')}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  {...register('city')}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  {...register('state')}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input 
                  id="zipCode" 
                  {...register('zipCode')}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="units">Number of Units</Label>
              <Input 
                id="units" 
                type="number" 
                min="1"
                {...register('units', { valueAsNumber: true })}
              />
              {errors.units && (
                <p className="text-sm text-red-500">{errors.units.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                rows={4} 
                {...register('description')}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isSaving}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
