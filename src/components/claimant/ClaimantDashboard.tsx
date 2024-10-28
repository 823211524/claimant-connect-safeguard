import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

interface Appointment {
  date: string;
  provider: string;
  doctor: string;
  userId: string;
}

const ClaimantDashboard = () => {
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const userAppointments = appointments.filter(apt => apt.userId === user.id);
      
      const upcoming = userAppointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      
      setNextAppointment(upcoming || null);
    }
  }, [user]);

  const claimantData = {
    claimNumber: "MVA2024001",
    accidentDate: "2024-01-15",
    status: "Active",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Claim Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-blue-600">Claim Number:</span> {claimantData.claimNumber}</p>
            <p><span className="font-medium text-blue-600">Accident Date:</span> {claimantData.accidentDate}</p>
            <p><span className="font-medium text-blue-600">Status:</span> 
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {claimantData.status}
              </span>
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Next Appointment</h2>
          <div className="space-y-2">
            {nextAppointment ? (
              <>
                <p><span className="font-medium text-blue-600">Date:</span> {new Date(nextAppointment.date).toLocaleDateString()}</p>
                <p><span className="font-medium text-blue-600">Provider:</span> {nextAppointment.provider}</p>
                <p><span className="font-medium text-blue-600">Doctor:</span> {nextAppointment.doctor}</p>
              </>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClaimantDashboard;