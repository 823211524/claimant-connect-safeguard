import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PasswordRequirements from './PasswordRequirements';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accidentDate, setAccidentDate] = useState('');
  const [accidentTime, setAccidentTime] = useState('');
  const [firstHospital, setFirstHospital] = useState('');
  const [involvedAs, setInvolvedAs] = useState<'pedestrian' | 'passenger' | 'driver'>('pedestrian');
  
  const { signUp } = useAuth();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const requirements = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return requirements.every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast({
        title: "Error",
        description: "Password does not meet requirements",
        variant: "destructive",
      });
      return;
    }

    if (!accidentDate || !accidentTime || !firstHospital || !involvedAs) {
      toast({
        title: "Error",
        description: "Please fill in all accident details",
        variant: "destructive",
      });
      return;
    }

    try {
      await signUp(email, password, name, {
        date: accidentDate,
        time: accidentTime,
        firstHospital,
        involvedAs,
      });
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <PasswordRequirements password={password} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Accident Details</h3>
          
          <div className="space-y-2">
            <label htmlFor="accidentDate" className="text-sm font-medium text-gray-700">
              Date of Accident
            </label>
            <Input
              id="accidentDate"
              type="date"
              value={accidentDate}
              onChange={(e) => setAccidentDate(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="accidentTime" className="text-sm font-medium text-gray-700">
              Approximate Time of Accident
            </label>
            <Input
              id="accidentTime"
              type="time"
              value={accidentTime}
              onChange={(e) => setAccidentTime(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="firstHospital" className="text-sm font-medium text-gray-700">
              First Hospital/Clinic Visited
            </label>
            <Input
              id="firstHospital"
              type="text"
              value={firstHospital}
              onChange={(e) => setFirstHospital(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="involvedAs" className="text-sm font-medium text-gray-700">
              Involved As
            </label>
            <Select value={involvedAs} onValueChange={(value: 'pedestrian' | 'passenger' | 'driver') => setInvolvedAs(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your involvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pedestrian">Pedestrian</SelectItem>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm;