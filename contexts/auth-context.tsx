'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string | null;
  // Add other user properties as needed from your Prisma schema
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>; // Modified to accept token directly
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('bellbot-token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Fetch user data using the token
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user); // Assuming API returns { user: UserData }
          } else {
            // Token might be invalid or expired
            console.error('Failed to fetch user with stored token');
            localStorage.removeItem('bellbot-token');
            document.cookie = 'bellbot-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
            setToken(null);
            setUser(null);
            // Optionally redirect to login if on a protected page, 
            // but middleware should primarily handle this.
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('bellbot-token');
          document.cookie = 'bellbot-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    alert('[AuthContext] login started.');
    setIsLoading(true);
    localStorage.setItem('bellbot-token', newToken);
    document.cookie = `bellbot-token=${newToken}; path=/; max-age=${60*60*24*7}; SameSite=Lax`; // 7 days
    setToken(newToken);
    alert('[AuthContext] Token stored and setInState.');
    try {
      alert('[AuthContext] Attempting fetch to /api/auth/me...');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${newToken}`,
        },
      });
      alert(`[AuthContext] /api/auth/me fetch completed. Status: ${response.status}, OK: ${response.ok}`);
      if (response.ok) {
        alert('[AuthContext] /api/auth/me response OK. Attempting response.json()...');
        const userData = await response.json();
        alert('[AuthContext] /api/auth/me response.json() completed. User data keys: ' + (userData.user ? Object.keys(userData.user).join(', ') : 'userData.user is null/undefined'));
        setUser(userData.user);
        alert('[AuthContext] setUser called. Attempting router.push(\'/dashboard\').');
        router.push('/dashboard'); // Redirect after successful login and user fetch
        alert('[AuthContext] router.push(\'/dashboard\') called from login.');
      } else {
        // Handle error fetching user after login
        console.error('Failed to fetch user after login');
        alert('[AuthContext] /api/auth/me failed. Calling logout().');
        logout(); // This will clear state and redirect to login
      }
    } catch (error) {
      console.error('Error fetching user data after login:', error);
      alert('[AuthContext] Exception during /api/auth/me fetch. Calling logout(). Error: ' + (error instanceof Error ? error.message : String(error)));
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    alert('[AuthContext] logout started.');
    localStorage.removeItem('bellbot-token');
    document.cookie = 'bellbot-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    setUser(null);
    setToken(null);
    alert('[AuthContext] State cleared. Attempting router.push(\'/login\').');
    router.push('/login'); // Redirect to login page on logout
    alert('[AuthContext] router.push(\'/login\') called from logout.');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
