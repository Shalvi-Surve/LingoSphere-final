import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, SignOutCommand, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
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

// AWS Cognito Configuration
const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
});

const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      // Verify token with Cognito
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await cognitoClient.send(command);
      
      if (response.Username) {
        // Check if user is admin (you can customize this logic)
        const isAdmin = response.UserAttributes?.find(
          attr => attr.Name === 'custom:isAdmin'
        )?.Value === 'true';

        setUser({
          id: response.Username,
          email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value || '',
          name: response.UserAttributes?.find(attr => attr.Name === 'name')?.Value || '',
          isAdmin,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name },
        ],
      });

      await cognitoClient.send(command);
      toast.success('Account created! Please check your email for verification code.');
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
      
      const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
      });

      await cognitoClient.send(command);
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
      
      const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await cognitoClient.send(command);
      
      if (response.AuthenticationResult?.AccessToken) {
        localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);
        if (response.AuthenticationResult.RefreshToken) {
          localStorage.setItem('refreshToken', response.AuthenticationResult.RefreshToken);
        }

        // Get user details
        const userCommand = new GetUserCommand({
          AccessToken: response.AuthenticationResult.AccessToken,
        });

        const userResponse = await cognitoClient.send(userCommand);
        
        if (userResponse.Username) {
          const isAdmin = userResponse.UserAttributes?.find(
            attr => attr.Name === 'custom:isAdmin'
          )?.Value === 'true';

          setUser({
            id: userResponse.Username,
            email: userResponse.UserAttributes?.find(attr => attr.Name === 'email')?.Value || '',
            name: userResponse.UserAttributes?.find(attr => attr.Name === 'name')?.Value || '',
            isAdmin,
          });

          toast.success('Welcome back!');
          return true;
        }
      }
      
      return false;
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
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const command = new SignOutCommand({
          AccessToken: accessToken,
        });
        await cognitoClient.send(command);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Signed out successfully');
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

