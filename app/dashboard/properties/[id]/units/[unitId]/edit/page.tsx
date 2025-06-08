"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

const unitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  floor: z.string().optional().nullable(),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms must be 0 or greater'),
  bathrooms: z.coerce.number().min(0, 'Bathrooms must be 0 or greater'),
  squareFeet: z.coerce.number().int().min(0, 'Square feet must be 0 or greater').optional().nullable(),
  maxOccupancy: z.coerce.number().int().min(0, 'Max occupancy must be 0 or greater').optional().nullable(),
  description: z.string().optional().nullable(),
  accessInstructions: z.string().optional().nullable(),
  lockboxCode: z.string().optional().nullable(),
  wifiName: z.string().optional().nullable(),
  wifiPassword: z.string().optional().nullable(),
  specialNotes: z.string().optional().nullable(),
})

type UnitFormValues = z.infer<typeof unitSchema>

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

// Inline Label component
const Label = ({ htmlFor, className = '', children, ...props }: { htmlFor?: string, className?: string, children: React.ReactNode, [key: string]: any }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

// Inline Input component
const Input = ({ className = '', type = 'text', ...props }: { className?: string, type?: string, [key: string]: any }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Inline Textarea component
const Textarea = ({ className = '', ...props }: { className?: string, [key: string]: any }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
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

export default function EditUnitPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  const unitId = params.unitId as string
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      name: '',
      unitNumber: '',
      floor: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: null,
      maxOccupancy: null,
      description: '',
      accessInstructions: '',
      lockboxCode: '',
      wifiName: '',
      wifiPassword: '',
      specialNotes: '',
    }
  })
  
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
        
        const unitData = await response.json()
        
        // Reset form with unit data
        reset({
          name: unitData.name,
          unitNumber: unitData.unitNumber,
          floor: unitData.floor || '',
          bedrooms: unitData.bedrooms,
          bathrooms: unitData.bathrooms,
          squareFeet: unitData.squareFeet || null,
          maxOccupancy: unitData.maxOccupancy || null,
          description: unitData.description || '',
          accessInstructions: unitData.accessInstructions || '',
          lockboxCode: unitData.lockboxCode || '',
          wifiName: unitData.wifiName || '',
          wifiPassword: unitData.wifiPassword || '',
          specialNotes: unitData.specialNotes || '',
        })
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching unit details:', err)
        setError('Failed to load unit details. Please try again.')
        setIsLoading(false)
      }
    }
    
    fetchUnitDetails()
  }, [unitId, router, reset])
  
  const onSubmit = async (data: UnitFormValues) => {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(false)
      
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }
      
      const response = await fetch(`/api/units/${unitId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update unit')
      }
      
      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/properties/${propertyId}/units/${unitId}`)
      }, 1500)
    } catch (err) {
      console.error('Error updating unit:', err)
      setError('Failed to update unit. Please try again.')
      setIsSaving(false)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => router.push(`/dashboard/properties/${propertyId}/units/${unitId}`)}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Unit Details
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Edit Unit</h1>
      
      {error && <Alert title="Error" description={error} variant="error" />}
      {success && <Alert title="Success" description="Unit updated successfully" variant="info" />}
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <Label htmlFor="name">Unit Name *</Label>
                <Input
                  id="name"
                  placeholder="Unit Name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="unitNumber">Unit Number *</Label>
                <Input
                  id="unitNumber"
                  placeholder="Unit Number"
                  {...register('unitNumber')}
                  className={errors.unitNumber ? 'border-red-500' : ''}
                />
                {errors.unitNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.unitNumber.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  placeholder="Floor"
                  {...register('floor')}
                  className={errors.floor ? 'border-red-500' : ''}
                />
                {errors.floor && (
                  <p className="text-red-500 text-sm mt-1">{errors.floor.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  {...register('bedrooms')}
                  className={errors.bedrooms ? 'border-red-500' : ''}
                />
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  {...register('bathrooms')}
                  className={errors.bathrooms ? 'border-red-500' : ''}
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  type="number"
                  min="0"
                  {...register('squareFeet')}
                  className={errors.squareFeet ? 'border-red-500' : ''}
                />
                {errors.squareFeet && (
                  <p className="text-red-500 text-sm mt-1">{errors.squareFeet.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="maxOccupancy">Max Occupancy</Label>
                <Input
                  id="maxOccupancy"
                  type="number"
                  min="0"
                  {...register('maxOccupancy')}
                  className={errors.maxOccupancy ? 'border-red-500' : ''}
                />
                {errors.maxOccupancy && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxOccupancy.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter unit description"
                {...register('description')}
                className={`${errors.description ? 'border-red-500' : ''} mt-1`}
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Access Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="md:col-span-2">
                <Label htmlFor="accessInstructions">Access Instructions</Label>
                <Textarea
                  id="accessInstructions"
                  placeholder="Instructions for accessing the unit"
                  {...register('accessInstructions')}
                  className={errors.accessInstructions ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.accessInstructions && (
                  <p className="text-red-500 text-sm mt-1">{errors.accessInstructions.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lockboxCode">Lockbox Code</Label>
                <Input
                  id="lockboxCode"
                  placeholder="Lockbox Code"
                  {...register('lockboxCode')}
                  className={errors.lockboxCode ? 'border-red-500' : ''}
                />
                {errors.lockboxCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.lockboxCode.message}</p>
                )}
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Network Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <Label htmlFor="wifiName">WiFi Name</Label>
                <Input
                  id="wifiName"
                  placeholder="WiFi Network Name"
                  {...register('wifiName')}
                  className={errors.wifiName ? 'border-red-500' : ''}
                />
                {errors.wifiName && (
                  <p className="text-red-500 text-sm mt-1">{errors.wifiName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="wifiPassword">WiFi Password</Label>
                <Input
                  id="wifiPassword"
                  placeholder="WiFi Password"
                  {...register('wifiPassword')}
                  className={errors.wifiPassword ? 'border-red-500' : ''}
                />
                {errors.wifiPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.wifiPassword.message}</p>
                )}
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            
            <div>
              <Label htmlFor="specialNotes">Special Notes</Label>
              <Textarea
                id="specialNotes"
                placeholder="Special notes about this unit"
                {...register('specialNotes')}
                className={errors.specialNotes ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.specialNotes && (
                <p className="text-red-500 text-sm mt-1">{errors.specialNotes.message}</p>
              )}
            </div>
          </Card>
          
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => router.push(`/dashboard/properties/${propertyId}/units/${unitId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
