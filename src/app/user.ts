export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'hr_team' | 'admin';
  department: string;
  businessUnit: string;
}
