import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppointmentLetter from './AppointmentLetter';
import { useAuth } from '@/context/AuthContext';

const AppointmentBooking = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [showLetter, setShowLetter] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ];

  const handleBooking = () => {
    if (!date || !time) {
      toast({
        title: "Error",
        description: "Please select both date and time for your appointment",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking success
    toast({
      title: "Success",
      description: "Your appointment has been booked successfully",
    });
    setShowLetter(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Select Time</h2>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((t) => (
              <Button
                key={t}
                variant={time === t ? "default" : "outline"}
                onClick={() => setTime(t)}
                className="w-full"
              >
                {t}
              </Button>
            ))}
          </div>

          <Button
            onClick={handleBooking}
            className="w-full mt-6"
            disabled={!date || !time}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {showLetter && date && time && user && (
        <div className="mt-8">
          <AppointmentLetter
            appointmentDate={date}
            appointmentTime={time}
            claimantName={user.name}
            claimantId={user.id}
            serviceProvider="MVA Medical Center"
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;