import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/context/AuthContext';
import { Trash2 } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  services: string[];
}

interface Provider {
  id: string;
  name: string;
  doctors: Doctor[];
}

const providers: Provider[] = [
  { 
    id: '1', 
    name: 'Gaborone Private Hospital',
    doctors: [
      { 
        id: 'd1', 
        name: 'Dr. Lekgowe - Orthopedic Surgeon',
        services: ['Orthopedic Consultation', 'Joint Replacement', 'Fracture Treatment', 'Sports Injury Treatment']
      },
      { 
        id: 'd2', 
        name: 'Dr. Mokgalong - Physiotherapist',
        services: ['Physical Therapy', 'Rehabilitation', 'Sports Medicine', 'Pain Management']
      }
    ]
  },
  { 
    id: '2', 
    name: 'Sidilega Private Hospital',
    doctors: [
      { 
        id: 'd3', 
        name: 'Dr. Mamonyane - Neurologist',
        services: ['Neurological Consultation', 'EEG Testing', 'Nerve Conduction Studies', 'Headache Treatment']
      },
      { 
        id: 'd4', 
        name: 'Dr. Lekgowe - Pain Specialist',
        services: ['Pain Management', 'Nerve Blocks', 'Chronic Pain Treatment', 'Medication Management']
      }
    ]
  },
  { 
    id: '3', 
    name: 'Bokamoso Private Hospital',
    doctors: [
      { 
        id: 'd5', 
        name: 'Dr. Mokgalong - Rehabilitation Specialist',
        services: ['Occupational Therapy', 'Physical Rehabilitation', 'Functional Assessment', 'Return to Work Programs']
      },
      { 
        id: 'd6', 
        name: 'Dr. Mamonyane - Physical Therapist',
        services: ['Physiotherapy', 'Manual Therapy', 'Exercise Prescription', 'Post-operative Rehabilitation']
      }
    ]
  },
];

const AppointmentBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
  }, []);

  const selectedProviderDoctors = providers.find(p => p.id === selectedProvider)?.doctors || [];
  const selectedDoctorServices = selectedProviderDoctors.find(d => d.id === selectedDoctor)?.services || [];

  const handleBookAppointment = () => {
    if (!date || !selectedProvider || !selectedDoctor || !selectedService) {
      toast({
        title: "Error",
        description: "Please select all required fields",
        variant: "destructive",
      });
      return;
    }

    const appointment = {
      id: Math.random().toString(36).substr(2, 9),
      date: date.toISOString(),
      provider: providers.find(p => p.id === selectedProvider)?.name,
      doctor: selectedProviderDoctors.find(d => d.id === selectedDoctor)?.name,
      service: selectedService,
      userId: user?.id
    };

    const updatedAppointments = [...appointments, appointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);

    toast({
      title: "Success",
      description: "Appointment booked successfully",
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);

    toast({
      title: "Success",
      description: "Appointment deleted successfully",
    });
  };

  const userAppointments = appointments.filter(apt => apt.userId === user?.id);

  return (
    <div className="space-y-8">
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
                setSelectedService('');
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
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedService('');
                }}
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

          {selectedDoctor && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-blue-700">Select Service</h3>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 border rounded-md border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">Select a service</option>
                {selectedDoctorServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
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
            disabled={!date || !selectedProvider || !selectedDoctor || !selectedService}
          >
            Book Appointment
          </Button>
        </div>
      </Card>

      {userAppointments.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Your Appointments</h2>
          <div className="space-y-4">
            {userAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-medium text-blue-800">{apt.provider}</p>
                  <p className="text-gray-600">{apt.doctor}</p>
                  <p className="text-gray-600">{apt.service}</p>
                  <p className="text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteAppointment(apt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AppointmentBooking;