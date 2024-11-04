import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AppointmentDocumentProps {
  appointment: {
    id: string;
    date: string;
    provider: string;
    doctor: string;
    service: string;
  };
}

const AppointmentDocument = ({ appointment }: AppointmentDocumentProps) => {
  const generatePDF = async () => {
    const element = document.getElementById('appointment-document');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`MVA_Appointment_${appointment.id}.pdf`);
  };

  return (
    <div className="relative">
      <Card id="appointment-document" className="p-8 bg-white relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg] text-6xl text-gray-500 pointer-events-none">
          MVA OFFICIAL DOCUMENT
        </div>

        <div className="relative z-10 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-800">Motor Vehicle Accident Fund</h2>
            <p className="text-gray-600">Official Appointment Confirmation</p>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Reference Number:</p>
              <p className="font-medium">{appointment.id}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Healthcare Provider:</p>
              <p className="font-medium">{appointment.provider}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Doctor:</p>
              <p className="font-medium">{appointment.doctor}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Service:</p>
              <p className="font-medium">{appointment.service}</p>
            </div>

            <div className="border-b pb-2">
              <p className="text-sm text-gray-600">Date & Time:</p>
              <p className="font-medium">{new Date(appointment.date).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>This document serves as official proof of appointment from the Motor Vehicle Accident Fund.</p>
            <p>Please present this document at the healthcare provider's reception.</p>
          </div>
        </div>
      </Card>

      <Button
        onClick={generatePDF}
        className="mt-4 w-full"
        variant="outline"
      >
        <Download className="w-4 h-4 mr-2" />
        Download PDF
      </Button>
    </div>
  );
};

export default AppointmentDocument;