'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button for logout

// Component for the navigation bar, using useAuth for logout and user info
function AuthenticatedNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // AuthContext handles token removal and redirect
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                BellBot
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/dashboard/properties" className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Properties
                </Link>
                <Link href="/dashboard/jobs" className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Jobs
                </Link>
                <Link href="/dashboard/providers" className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Providers
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <span className="text-gray-700 text-sm mr-3">
                  Hi, {user.name || user.email}!
                </span>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
          {/* Add mobile menu button and handling here if needed */}
        </div>
      </div>
    </nav>
  );
}

// This component will handle the redirection logic based on auth state
function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user && !token) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, isLoading, token, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    // This state might be brief as useEffect should redirect.
    // Or middleware might have already redirected server-side.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Main layout component for the dashboard
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // AuthProvider removed from here, it's in the root layout via ClientProviders
    <div className="min-h-screen bg-gray-100">
      <AuthenticatedNavbar /> {/* AuthenticatedNavbar uses useAuth, will access root AuthProvider */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <DashboardGuard>{children}</DashboardGuard> {/* DashboardGuard uses useAuth, will access root AuthProvider */}
        </div>
      </main>
    </div>
  );
}
