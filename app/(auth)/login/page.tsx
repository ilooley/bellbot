'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth(); // Get auth context
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onValidationErrors = (validationErrors: any) => {
    alert('Validation failed! Please check the form fields for error messages. Errors: ' + JSON.stringify(validationErrors));
    console.error('Client-side validation errors:', validationErrors);
    // You might want to set a general error message or focus the first invalid field here
  };

  const onSubmit = async (data: LoginForm) => {
    alert('Login onSubmit function started!'); // DEBUG: Check if function is called
    setIsLoading(true);
    setError('');

    try {
      alert('DEBUG: Attempting fetch to /api/auth/login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      alert(`DEBUG: Fetch completed. Status: ${response.status}, OK: ${response.ok}`);

      if (!response.ok) {
        let errorMsg = `Login failed (status ${response.status})`;
        try {
          const errorBodyText = await response.text(); // Read body as text first
          alert(`DEBUG: Response not OK. Body snippet: ${errorBodyText.substring(0, 100)}`);
          try {
            const errorJson = JSON.parse(errorBodyText); // Try to parse as JSON
            errorMsg = errorJson.message || errorJson.error || errorMsg;
          } catch (e) {
            // Not JSON, or JSON parsing failed. errorMsg already has status.
            // errorMsg = `${errorMsg}. Response: ${errorBodyText.substring(0,100)}`; // Optionally add raw snippet
          }
        } catch (e) {
          // Failed to even read response body as text
          alert('DEBUG: Response not OK, and failed to read error body.');
        }
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      alert('DEBUG: Attempting response.json()...');
      const result = await response.json(); // This can fail if body is not valid JSON despite response.ok
      alert('DEBUG: response.json() completed. Result keys: ' + Object.keys(result).join(', '));

      alert('DEBUG: Attempting auth.login(token)...');
      await auth.login(result.token);
      alert('DEBUG: auth.login(token) completed.');

      alert('DEBUG: Attempting router.push(\'/dashboard\')...');
      router.push('/dashboard');
      // alert('DEBUG: router.push() called.'); // Might not see if redirect is too fast

    } catch (err: any) {
      alert('CLIENT-SIDE ERROR during login: ' + (err.message ? err.message : JSON.stringify(err)));
      console.error('Login page client-side error:', err);
      setError('An error occurred during login. Please check details.');
      setIsLoading(false); // Ensure loading is stopped on error
    } finally {
      // setIsLoading(false); // Covered by error paths or navigation unmounts
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to BellBot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit, onValidationErrors)}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
