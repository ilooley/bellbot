'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// Define inline components
const Button = ({ 
  children, 
  variant = 'default', 
  className = '', 
  disabled = false, 
  type = 'button', 
  onClick 
}: { 
  children: React.ReactNode, 
  variant?: 'default' | 'ghost' | 'outline', 
  className?: string, 
  disabled?: boolean, 
  type?: 'button' | 'submit' | 'reset',
  onClick?: () => void 
}) => {
  let variantClasses = 'bg-blue-600 text-white hover:bg-blue-700'

  if (variant === 'ghost') {
    variantClasses = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  } else if (variant === 'outline') {
    variantClasses = 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-medium ${variantClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const Input = ({
  id,
  className = '',
  type = 'text',
  min,
  ...props
}: {
  id?: string,
  className?: string,
  type?: string,
  min?: string | number,
  [key: string]: any
}) => (
  <input
    id={id}
    type={type}
    min={min?.toString()}
    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
)

const Textarea = ({
  id,
  rows = 3,
  className = '',
  ...props
}: {
  id?: string,
  rows?: number,
  className?: string,
  [key: string]: any
}) => (
  <textarea
    id={id}
    rows={rows}
    className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
)

const Label = ({
  htmlFor,
  className = '',
  children
}: {
  htmlFor?: string,
  className?: string,
  children: React.ReactNode
}) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
  >
    {children}
  </label>
)
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

export default function NewPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
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

  const onSubmit = async (data: PropertyFormData) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create property')
      }
      
      // Success! Redirect to the properties list
      router.push('/dashboard/properties')
      router.refresh()
    } catch (err) {
      console.error('Error creating property:', err)
      setError('Failed to create property. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>
            Enter the details of your property to add it to your portfolio.
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Creating...' : 'Create Property'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
