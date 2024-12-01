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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Claim Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-blue-600">Claim Number:</span> {user.claimNumber}</p>
            <p><span className="font-medium text-blue-600">Accident Date:</span> {user.accidentDetails?.date || 'Not available'}</p>
            <p><span className="font-medium text-blue-600">Accident Location:</span> {user.accidentDetails?.location || 'Not available'}</p>
            <p><span className="font-medium text-blue-600">Accident Type:</span> {user.accidentDetails?.type || 'Not available'}</p>
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

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Coverage Periods</h2>
        <div className="space-y-4">
          {user.coveragePeriods && user.coveragePeriods.length > 0 ? (
            user.coveragePeriods.map((period, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <p className="font-medium text-blue-800">{period.type}</p>
                <p className="text-gray-600">From: {new Date(period.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600">To: {new Date(period.endDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No coverage periods available</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClaimantDashboard;