import React from 'react';
import { useAuth } from '@/context/AuthContext';
import html2pdf from 'html2pdf.js';

interface AppointmentDocumentProps {
  appointment: {
    date: string;
    provider: string;
    doctor: string;
    service: string;
  };
  onClose: () => void;
}

const AppointmentDocument = ({ appointment, onClose }: AppointmentDocumentProps) => {
  const { user } = useAuth();

  const handleDownload = () => {
    const element = document.getElementById('appointment-document');
    const opt = {
      margin: 1,
      filename: `appointment-confirmation-${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div id="appointment-document" className="relative bg-white p-8 rounded-lg">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="text-gray-400 text-6xl font-bold transform rotate-45">MVA</span>
            </div>
            
            {/* Content */}
            <div className="relative z-10 space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-800">Appointment Confirmation</h1>
                <p className="text-gray-600 mt-2">Motor Vehicle Accident Fund</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Claimant Information</h2>
                  <p className="text-gray-600">Name: {user?.name}</p>
                  <p className="text-gray-600">Claim Number: MVA{user?.id}</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Appointment Details</h2>
                  <p className="text-gray-600">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Provider: {appointment.provider}</p>
                  <p className="text-gray-600">Doctor: {appointment.doctor}</p>
                  <p className="text-gray-600">Service: {appointment.service}</p>
                </div>

                <div className="text-sm text-gray-500">
                  <p>This document serves as official proof of your appointment booking.</p>
                  <p>Please present this document at the healthcare facility.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDocument;