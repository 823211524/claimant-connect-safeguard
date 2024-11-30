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

  const fetchUserData = async (email: string) => {
    // First get the claimant data
    const { data: claimantData, error: claimantError } = await supabase
      .from('claimants')
      .select('*')
      .single();

    if (claimantError) {
      throw new Error('Failed to fetch claimant data');
    }

    // Then get accident details
    const { data: accidentDetails, error: accidentError } = await supabase
      .from('accident_details')
      .select('*')
      .eq('claimant_id', claimantData.id)
      .single();

    if (accidentError) {
      console.error('Error fetching accident details:', accidentError);
    }

    // Get coverage periods
    const { data: coveragePeriods, error: coverageError } = await supabase
      .from('coverage_periods')
      .select('*')
      .eq('claimant_id', claimantData.id);

    if (coverageError) {
      console.error('Error fetching coverage periods:', coverageError);
    }

    // Find the matching claimant from our static data for the name
    const staticClaimant = claimants.find(c => c.email === email);

    return {
      id: claimantData.id,
      name: staticClaimant?.name || 'Unknown',
      email: email,
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
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const claimant = claimants.find(c => c.email === email && c.password === password);
    
    if (!claimant) {
      throw new Error('Invalid credentials or claimant not found in MVA database');
    }

    try {
      const userData = await fetchUserData(email);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
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