import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  savedListings: string[];
  addSavedListing: (id: string) => void;
  removeSavedListing: (id: string) => void;
  isListingSaved: (id: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [savedListings, setSavedListings] = useState<string[]>(() => {
    const saved = localStorage.getItem('savedListings');
    return saved ? JSON.parse(saved) : [];
  });

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          if (userData.savedListings) {
            setSavedListings(userData.savedListings);
          }
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Persist saved listings to localStorage
  useEffect(() => {
    localStorage.setItem('savedListings', JSON.stringify(savedListings));
  }, [savedListings]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authApi.register({ email, password, name });
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const addSavedListing = (id: string) => {
    if (!savedListings.includes(id)) {
      setSavedListings([...savedListings, id]);
    }
  };

  const removeSavedListing = (id: string) => {
    setSavedListings(savedListings.filter((listingId) => listingId !== id));
  };

  const isListingSaved = (id: string) => {
    return savedListings.includes(id);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        savedListings,
        addSavedListing,
        removeSavedListing,
        isListingSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
