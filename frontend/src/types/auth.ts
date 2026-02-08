export type UserRole = 'farmer' | 'supplier' | 'buyer' | 'logistics' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone?: string;
  businessName?: string;
  location?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  businessName?: string;
  location?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}
