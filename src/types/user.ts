export interface User {
  id: string;
  email: string;
  name: string;
  coveragePeriods?: {
    startDate: string;
    endDate: string;
    type: string;
  }[];
  accidentDetails?: {
    date: string;
    time: string;
    firstHospital: string;
    involvedAs: 'pedestrian' | 'passenger' | 'driver';
  };
}