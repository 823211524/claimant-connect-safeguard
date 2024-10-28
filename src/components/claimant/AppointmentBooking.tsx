import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';

const AppointmentBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Updated medical providers with Botswana doctors
  const providers = [
    { 
      id: '1', 
      name: 'Gaborone Private Hospital',
      doctors: [
        { id: 'd1', name: 'Dr. Lekgowe - Orthopedic Surgeon' },
        { id: 'd2', name: 'Dr. Mokgalong - Physiotherapist' }
      ]
    },
    { 
      id: '2', 
      name: 'Sidilega Private Hospital',
      doctors: [
        { id: 'd3', name: 'Dr. Mamonyane - Neurologist' },
        { id: 'd4', name: 'Dr. Lekgowe - Pain Specialist' }
      ]
    },
    { 
      id: '3', 
      name: 'Bokamoso Private Hospital',
      doctors: [
        { id: 'd5', name: 'Dr. Mokgalong - Rehabilitation Specialist' },
        { id: 'd6', name: 'Dr. Mamonyane - Physical Therapist' }
      ]
    },
  ];

  const selectedProviderDoctors = providers.find(p => p.id === selectedProvider)?.doctors || [];

  const handleBookAppointment = () => {
    if (!date || !selectedProvider || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select date, provider and doctor",
        variant: "destructive",
      });
      return;
    }

    const appointment = {
      date: date.toISOString(),
      provider: providers.find(p => p.id === selectedProvider)?.name,
      doctor: selectedProviderDoctors.find(d => d.id === selectedDoctor)?.name,
      userId: user?.id
    };

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    toast({
      title: "Success",
      description: "Appointment booked successfully",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Book Appointment</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 text-blue-700">Select Provider</h3>
          <select
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              setSelectedDoctor('');
            }}
            className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <option value="">Select a provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProvider && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-700">Select Doctor</h3>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="">Select a doctor</option>
              {selectedProviderDoctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2 text-blue-700">Select Date</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-blue-200 p-3 bg-white"
          />
        </div>

        <Button
          onClick={handleBookAppointment}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          disabled={!date || !selectedProvider || !selectedDoctor}
        >
          Book Appointment
        </Button>
      </div>
    </Card>
  );
};

export default AppointmentBooking;