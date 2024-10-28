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

  // Mock medical providers with doctors
  const providers = [
    { 
      id: '1', 
      name: 'City Hospital',
      doctors: [
        { id: 'd1', name: 'Dr. Sarah Smith - Orthopedic Surgeon' },
        { id: 'd2', name: 'Dr. John Davis - Physiotherapist' }
      ]
    },
    { 
      id: '2', 
      name: 'Central Clinic',
      doctors: [
        { id: 'd3', name: 'Dr. Michael Chen - Neurologist' },
        { id: 'd4', name: 'Dr. Emily Brown - Pain Specialist' }
      ]
    },
    { 
      id: '3', 
      name: 'Medical Center',
      doctors: [
        { id: 'd5', name: 'Dr. James Wilson - Rehabilitation Specialist' },
        { id: 'd6', name: 'Dr. Lisa Anderson - Physical Therapist' }
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

    // Store appointment in localStorage
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
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Select Provider</h3>
          <select
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              setSelectedDoctor(''); // Reset doctor when provider changes
            }}
            className="w-full p-2 border rounded-md"
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
            <h3 className="text-lg font-medium mb-2">Select Doctor</h3>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-2 border rounded-md"
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
          <h3 className="text-lg font-medium mb-2">Select Date</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>

        <Button
          onClick={handleBookAppointment}
          className="w-full"
          disabled={!date || !selectedProvider || !selectedDoctor}
        >
          Book Appointment
        </Button>
      </div>
    </Card>
  );
};

export default AppointmentBooking;