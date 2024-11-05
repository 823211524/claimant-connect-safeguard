export const claimants = [
  {
    id: "CLM001",
    email: "john.doe@example.com",
    password: "password123", // In a real system, this would be hashed
    name: "John Doe",
    claimNumber: "MVA2024001",
    accidentDetails: {
      date: "2024-01-15",
      location: "Gaborone Main Mall",
      type: "Vehicle Collision"
    },
    coveragePeriods: [
      {
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        type: "Initial Coverage"
      }
    ]
  },
  {
    id: "CLM002",
    email: "sarah.smith@example.com",
    password: "password123",
    name: "Sarah Smith",
    claimNumber: "MVA2024002",
    accidentDetails: {
      date: "2024-02-01",
      location: "Francistown CBD",
      type: "Pedestrian Accident"
    },
    coveragePeriods: [
      {
        startDate: "2024-02-01",
        endDate: "2024-08-01",
        type: "Initial Coverage"
      },
      {
        startDate: "2024-08-02",
        endDate: "2024-12-31",
        type: "Extended Coverage"
      }
    ]
  },
  {
    id: "CLM003",
    email: "mike.brown@example.com",
    password: "password123",
    name: "Mike Brown",
    claimNumber: "MVA2024003",
    accidentDetails: {
      date: "2024-02-15",
      location: "Maun Bridge",
      type: "Vehicle Rollover"
    },
    coveragePeriods: [
      {
        startDate: "2024-02-15",
        endDate: "2024-08-15",
        type: "Initial Coverage"
      }
    ]
  }
];