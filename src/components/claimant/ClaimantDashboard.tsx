import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const ClaimantDashboard = () => {
  const { user } = useAuth();

  // Mock claimant data
  const claimantData = {
    claimNumber: "MVA2024001",
    accidentDate: "2024-01-15",
    status: "Active",
    nextAppointment: "2024-02-01",
    medicalProvider: "City Hospital",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Claim Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Claim Number:</span> {claimantData.claimNumber}</p>
            <p><span className="font-medium">Accident Date:</span> {claimantData.accidentDate}</p>
            <p><span className="font-medium">Status:</span> 
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {claimantData.status}
              </span>
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Next Appointment</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Date:</span> {claimantData.nextAppointment}</p>
            <p><span className="font-medium">Provider:</span> {claimantData.medicalProvider}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClaimantDashboard;