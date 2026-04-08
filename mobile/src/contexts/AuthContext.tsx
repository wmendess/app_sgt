import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUserData, saveUserData, removeUserData } from '../services/auth';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  getUserName: () => string;
  getUserDisplayName: () => string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await getUserData();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData: User) => {
    await saveUserData(userData);
    setUser(userData);
  };

  const signOut = async () => {
    await removeUserData();
    setUser(null);
  };

  const getUserName = (): string => {
    if (!user) return '';
    return user.nome || user.name || user.agente || '';
  };

  const getUserDisplayName = (): string => {
    const name = getUserName();
    if (!name) return '';
    // Exibe apenas o sobrenome ou nome abreviado
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}. ${parts[parts.length - 1]}`.toUpperCase();
    }
    return name.toUpperCase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        getUserName,
        getUserDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
