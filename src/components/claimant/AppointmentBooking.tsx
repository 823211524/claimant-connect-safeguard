import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';

const providers = [
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
  const [appointments, setAppointments] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
  }, []);

  const handleBookAppointment = (appointmentData: any) => {
    const appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...appointmentData,
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
      <AppointmentForm 
        providers={providers}
        onSubmit={handleBookAppointment}
      />
      {userAppointments.length > 0 && (
        <AppointmentList
          appointments={userAppointments}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentBooking;
