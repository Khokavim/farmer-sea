import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, SignupCredentials, AuthContextType } from '@/types/auth';
import { apiService } from '@/services/api';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token by fetching user profile
      apiService.getProfile()
        .then((response) => {
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear token
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    // Call logout API (optional)
    apiService.logout().catch(console.error);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.updateProfile(updates);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

