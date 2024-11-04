import React from 'react';
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface AppointmentDocumentProps {
  appointment: {
    referenceNumber: string;
    healthcareProvider: string;
    doctor: string;
    service: string;
    date: string;
    time: string;
  };
}

const AppointmentDocument: React.FC<AppointmentDocumentProps> = ({ appointment }) => {
  const downloadPDF = async () => {
    const element = document.getElementById('appointment-document');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`appointment-${appointment.referenceNumber}.pdf`);
    }
  };

  return (
    <div className="my-4">
      <div
        id="appointment-document"
        className="relative p-8 bg-gradient-from-blue-50 to-purple-50 rounded-lg shadow-md border border-gray-200 overflow-hidden"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-yellow-200 text-6xl font-bold transform rotate-45 opacity-20">
            MVA OFFICIAL DOCUMENT
          </p>
        </div>

        {/* Document Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Appointment Confirmation
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Reference Number:</p>
              <p>{appointment.referenceNumber}</p>
            </div>
            
            <div>
              <p className="font-semibold">Healthcare Provider:</p>
              <p>{appointment.healthcareProvider}</p>
            </div>
            
            <div>
              <p className="font-semibold">Doctor:</p>
              <p>{appointment.doctor}</p>
            </div>
            
            <div>
              <p className="font-semibold">Service:</p>
              <p>{appointment.service}</p>
            </div>
            
            <div>
              <p className="font-semibold">Date:</p>
              <p>{appointment.date}</p>
            </div>
            
            <div>
              <p className="font-semibold">Time:</p>
              <p>{appointment.time}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={downloadPDF}>
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default AppointmentDocument;