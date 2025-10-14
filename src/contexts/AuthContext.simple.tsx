import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<boolean>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple Auth Provider Component (without AWS for now)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('lingoUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('lingoUser');
      }
    }
  }, []);

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isAdmin: email.includes('admin')
      };
      
      setUser(mockUser);
      localStorage.setItem('lingoUser', JSON.stringify(mockUser));
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Email verified! You can now sign in.');
      return true;
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      toast.error(error.message || 'Failed to verify email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        isAdmin: email.includes('admin')
      };
      
      setUser(mockUser);
      localStorage.setItem('lingoUser', JSON.stringify(mockUser));
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem('lingoUser');
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    confirmSignUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
