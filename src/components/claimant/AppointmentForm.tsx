import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface AppointmentFormProps {
  providers: Array<{
    id: string;
    name: string;
    doctors: Array<{
      id: string;
      name: string;
      services: string[];
    }>;
  }>;
  onSubmit: (appointment: any) => void;
}

const AppointmentForm = ({ providers, onSubmit }: AppointmentFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const { toast } = useToast();

  const selectedProviderDoctors = providers.find(p => p.id === selectedProvider)?.doctors || [];
  const selectedDoctorServices = selectedProviderDoctors.find(d => d.id === selectedDoctor)?.services || [];

  const handleSubmit = () => {
    if (!date || !selectedProvider || !selectedDoctor || !selectedService) {
      toast({
        title: "Error",
        description: "Please select all required fields",
        variant: "destructive",
      });
      return;
    }

    const appointment = {
      date: date.toISOString(),
      provider: providers.find(p => p.id === selectedProvider)?.name,
      doctor: selectedProviderDoctors.find(d => d.id === selectedDoctor)?.name,
      service: selectedService,
    };

    onSubmit(appointment);
  };

  return (
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
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        disabled={!date || !selectedProvider || !selectedDoctor || !selectedService}
      >
        Book Appointment
      </Button>
    </div>
  );
};

export default AppointmentForm;