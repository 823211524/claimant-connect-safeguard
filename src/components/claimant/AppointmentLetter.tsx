import React from 'react';
import { format } from 'date-fns';
import { Card } from "@/components/ui/card";

interface AppointmentLetterProps {
  appointmentDate: Date;
  claimantName: string;
  claimantId: string;
  serviceProvider: string;
  appointmentTime: string;
}

const AppointmentLetter = ({
  appointmentDate,
  claimantName,
  claimantId,
  serviceProvider,
  appointmentTime,
}: AppointmentLetterProps) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto p-8 bg-white">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.15] rotate-[-30deg] pointer-events-none">
        <div className="text-6xl font-bold text-gray-400 select-none">
          MVA OFFICIAL
        </div>
      </div>

      <Card className="p-8 relative z-10 border-2">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Motor Vehicle Accident Fund</h2>
              <p className="text-gray-600">P.O. Box 25439</p>
              <p className="text-gray-600">Gaborone, Botswana</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Date: {format(new Date(), 'dd/MM/yyyy')}</p>
              <p className="text-gray-600">Ref: MVA-{claimantId}-{format(appointmentDate, 'yyyyMMdd')}</p>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-xl font-semibold text-center mb-6">
              APPOINTMENT CONFIRMATION LETTER
            </h1>

            <p className="mb-4">
              This letter confirms that {claimantName} (Claimant ID: {claimantId}) has a scheduled
              appointment at {serviceProvider} on {format(appointmentDate, 'dd MMMM yyyy')} at {appointmentTime}.
            </p>

            <p className="mb-4">
              This appointment has been approved and authorized by the Motor Vehicle Accident Fund.
              Please present this letter upon arrival at the service provider's reception.
            </p>

            <div className="mt-8">
              <p className="font-semibold">Important Notes:</p>
              <ul className="list-disc ml-6 text-gray-700">
                <li>Please arrive 15 minutes before your scheduled appointment time</li>
                <li>Bring a valid form of identification</li>
                <li>This letter is only valid for the specified appointment date and time</li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="font-semibold">Verification:</p>
              <p className="text-sm text-gray-600">
                To verify the authenticity of this letter, please contact MVA Fund at +267 391 3853
                or email verification@mvafund.bw quoting the reference number above.
              </p>
            </div>

            <div className="mt-8">
              <div className="w-48">
                <img 
                  src="/mva-signature.png" 
                  alt="Digital Signature" 
                  className="w-full"
                />
                <p className="mt-2 text-sm font-semibold">Authorized Signature</p>
                <p className="text-sm text-gray-600">MVA Fund Officer</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentLetter;