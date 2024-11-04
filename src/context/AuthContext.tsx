import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    name: string,
    accidentDetails: {
      date: string;
      time: string;
      firstHospital: string;
      involvedAs: 'pedestrian' | 'passenger' | 'driver';
    }
  ) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Ensure email is not undefined before calling toLowerCase()
      const emailLower = email?.toLowerCase() || '';
      let mockUser: User;
      
      switch (emailLower) {
        case 'bernard@example.com':
          mockUser = {
            id: '1',
            email: emailLower,
            name: 'Bernard Matlho',
            coveragePeriods: [
              {
                startDate: '2024-01-15',
                endDate: '2024-07-15',
                type: 'Initial Coverage'
              }
            ]
          };
          break;
        case 'keabetswe@example.com':
          mockUser = {
            id: '2',
            email: emailLower,
            name: 'Keabetswe Mokgalong',
            coveragePeriods: [
              {
                startDate: '2024-02-01',
                endDate: '2024-08-01',
                type: 'Initial Coverage'
              }
            ]
          };
          break;
        case 'cliff@example.com':
          mockUser = {
            id: '3',
            email: emailLower,
            name: 'Cliff Keabetswe',
            coveragePeriods: [
              {
                startDate: '2024-03-01',
                endDate: '2024-09-01',
                type: 'Initial Coverage'
              }
            ]
          };
          break;
        default:
          mockUser = {
            id: '1',
            email: emailLower,
            name: 'Bernard Matlho',
            coveragePeriods: [
              {
                startDate: '2024-01-15',
                endDate: '2024-07-15',
                type: 'Initial Coverage'
              }
            ]
          };
      }
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    accidentDetails: {
      date: string;
      time: string;
      firstHospital: string;
      involvedAs: 'pedestrian' | 'passenger' | 'driver';
    }
  ) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email?.toLowerCase() || '',
        name,
        accidentDetails,
        coveragePeriods: [
          {
            startDate: accidentDetails.date,
            endDate: new Date(new Date(accidentDetails.date).setMonth(new Date(accidentDetails.date).getMonth() + 6)).toISOString().split('T')[0],
            type: 'Initial Coverage'
          }
        ]
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
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