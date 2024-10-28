import { useSearchParams } from 'react-router-dom';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/context/AuthContext';
import ClaimantDashboard from '@/components/claimant/ClaimantDashboard';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const authMode = searchParams.get('auth');

  if (user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ClaimantDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {authMode === 'signup' ? <SignUpForm /> : <SignInForm />}
        </div>
      </div>
    </div>
  );
};

export default Index;