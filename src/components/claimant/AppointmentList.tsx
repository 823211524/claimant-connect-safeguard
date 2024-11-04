import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import AppointmentDocument from './AppointmentDocument';

interface AppointmentListProps {
  appointments: any[];
  onDelete: (id: string) => void;
}

const AppointmentList = ({ appointments, onDelete }: AppointmentListProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Your Appointments</h2>
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="space-y-4">
            <div className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-medium text-blue-800">{apt.provider}</p>
                <p className="text-gray-600">{apt.doctor}</p>
                <p className="text-gray-600">{apt.service}</p>
                <p className="text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(apt.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <AppointmentDocument appointment={apt} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AppointmentList;