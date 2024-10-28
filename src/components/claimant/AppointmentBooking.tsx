import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';

const AppointmentBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState('');
  const { toast } = useToast();

  // Mock medical providers
  const providers = [
    { id: '1', name: 'City Hospital' },
    { id: '2', name: 'Central Clinic' },
    { id: '3', name: 'Medical Center' },
  ];

  const handleBookAppointment = () => {
    if (!date || !selectedProvider) {
      toast({
        title: "Error",
        description: "Please select both date and provider",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking appointment
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
            onChange={(e) => setSelectedProvider(e.target.value)}
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
          disabled={!date || !selectedProvider}
        >
          Book Appointment
        </Button>
      </div>
    </Card>
  );
};

export default AppointmentBooking;