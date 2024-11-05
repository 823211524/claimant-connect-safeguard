import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/context/AuthContext';
import ClaimantDashboard from '@/components/claimant/ClaimantDashboard';

const Index = () => {
  const { user } = useAuth();

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
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default Index;