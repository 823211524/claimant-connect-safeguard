import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AppointmentListProps {
  appointments: Array<{
    id: string;
    date: string;
    provider: string;
    doctor: string;
    service: string;
  }>;
  onDelete: (id: string) => void;
  onViewDocument: (appointment: any) => void;
}

const AppointmentList = ({ appointments, onDelete, onViewDocument }: AppointmentListProps) => {
  return (
    <div className="space-y-4">
      {appointments.map((apt) => (
        <div key={apt.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="font-medium text-blue-800">{apt.provider}</p>
            <p className="text-gray-600">{apt.doctor}</p>
            <p className="text-gray-600">{apt.service}</p>
            <p className="text-gray-500">{new Date(apt.date).toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onViewDocument(apt)}
            >
              View Document
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(apt.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;