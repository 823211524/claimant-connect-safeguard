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
      fetchUserData(parsedUser.claimNumber);
    }
  }, []);

  const fetchUserData = async (claimNumber: string) => {
    try {
      // Fetch claimant data using claim_number instead of user_id
      const { data: claimantData, error: claimantError } = await supabase
        .from('claimants')
        .select('*')
        .eq('claim_number', claimNumber)
        .single();

      if (claimantError) throw claimantError;

      if (claimantData) {
        // Fetch accident details using claimant_id
        const { data: accidentDetails, error: accidentError } = await supabase
          .from('accident_details')
          .select('*')
          .eq('claimant_id', claimantData.id)
          .single();

        if (accidentError) throw accidentError;

        // Fetch coverage periods using claimant_id
        const { data: coveragePeriods, error: coverageError } = await supabase
          .from('coverage_periods')
          .select('*')
          .eq('claimant_id', claimantData.id);

        if (coverageError) throw coverageError;

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
    await fetchUserData(userWithoutPassword.claimNumber);
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