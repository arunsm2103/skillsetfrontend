export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'employee' | 'manager' | 'hr_team' | 'admin';
  department?: string;
  businessUnit?: string;
  designation?: string;
  dateOfJoining?: string;
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }[];
  teamHierarchy?: {
    reportingManager: string;
    directReports: string[];
  };
  ongoingProjects?: {
    name: string;
    role: string;
    startDate: string;
    endDate?: string;
    status: string;
  }[];
  experience?: {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description: string;
  }[];
  skillsets?: {
    code: string;
    name: string;
    grade: string;
    otherInfo?: string;
    date: string;
  }[];
  trainingCourses?: {
    courseName: string;
    provider: string;
    startDate: string;
    endDate?: string;
    status: 'ongoing' | 'completed' | 'planned';
    progress?: number;
    description?: string;
  }[];
} 