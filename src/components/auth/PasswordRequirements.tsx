import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = [
    {
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      text: "Contains uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      text: "Contains lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      text: "Contains number",
      met: /[0-9]/.test(password),
    },
    {
      text: "Contains special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium text-gray-700">Password requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className="text-sm flex items-center space-x-2"
          >
            {req.met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-red-500" />
            )}
            <span className={req.met ? "text-green-700" : "text-red-700"}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;