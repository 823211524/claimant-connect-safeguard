import { createContext, useContext, useState, useEffect } from 'react';
import { claimants } from '@/data/claimants';

interface User {
  id: string;
  name: string;
  email: string;
  claimNumber: string;
  accidentDetails: {
    date: string;
    location: string;
    type: string;
  };
  coveragePeriods: Array<{
    startDate: string;
    endDate: string;
    type: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const claimant = claimants.find(c => c.email === email && c.password === password);
    
    if (!claimant) {
      throw new Error('Invalid credentials or claimant not found in MVA database');
    }

    const { password: _, ...userWithoutPassword } = claimant;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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