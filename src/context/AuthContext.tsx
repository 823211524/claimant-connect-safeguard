import { createContext, useContext, useState, useEffect } from 'react';
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

  const fetchUserData = async (email: string) => {
    try {
      // Fetch claimant data
      const { data: claimantData, error: claimantError } = await supabase
        .from('claimants')
        .select(`
          id,
          claim_number,
          accident_details (
            date,
            location,
            type
          ),
          coverage_periods (
            start_date,
            end_date,
            type
          )
        `)
        .single();

      if (claimantError) throw claimantError;

      const userData: User = {
        id: claimantData.id,
        name: email.split('@')[0], // Using email username as name for now
        email: email,
        claimNumber: claimantData.claim_number,
        accidentDetails: claimantData.accident_details?.[0] ? {
          date: claimantData.accident_details[0].date,
          location: claimantData.accident_details[0].location,
          type: claimantData.accident_details[0].type
        } : undefined,
        coveragePeriods: claimantData.coverage_periods?.map(period => ({
          startDate: period.start_date,
          endDate: period.end_date,
          type: period.type
        }))
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      await fetchUserData(email);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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