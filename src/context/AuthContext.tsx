import { createContext, useContext, useState, useEffect } from 'react';
import { claimants } from '@/data/claimants';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  claimNumber: string;
  accidentDetails?: {
    date: string;
    location: string;
    type: string;
  };
  coveragePeriods?: Array<{
    startDate: string;
    endDate: string;
    type: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserData(parsedUser.id);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch claimant data
      const { data: claimantData } = await supabase
        .from('claimants')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (claimantData) {
        // Fetch accident details
        const { data: accidentDetails } = await supabase
          .from('accident_details')
          .select('*')
          .eq('claimant_id', claimantData.id)
          .single();

        // Fetch coverage periods
        const { data: coveragePeriods } = await supabase
          .from('coverage_periods')
          .select('*')
          .eq('claimant_id', claimantData.id);

        // Update user state with fetched data
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            claimNumber: claimantData.claim_number,
            accidentDetails: accidentDetails ? {
              date: accidentDetails.date,
              location: accidentDetails.location,
              type: accidentDetails.type
            } : undefined,
            coveragePeriods: coveragePeriods ? coveragePeriods.map(period => ({
              startDate: period.start_date,
              endDate: period.end_date,
              type: period.type
            })) : []
          };
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const claimant = claimants.find(c => c.email === email && c.password === password);
    
    if (!claimant) {
      throw new Error('Invalid credentials or claimant not found in MVA database');
    }

    const { password: _, ...userWithoutPassword } = claimant;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    await fetchUserData(userWithoutPassword.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout }}>
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