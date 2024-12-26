import ApiService from "./api";

export const getUser = async (id: string) => {
  try {
    const response = await ApiService.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


  export interface User {
    id: string;
    employeeCode: string;
    employeeName: string;
    businessUnit: string;
    department: string;
    officialEmail: string;
    designation: string;
    gender: string;
    role: string;
    dateOfJoining: string;
    isActive: boolean;
    reportingManager?: User | null;
    roles: Array<{
      id: string;
      name: string;
      permissions: string[];
    }>;
  }
  
  export interface CreateUserPayload {
    employeeCode: string;
    password: string;
    employeeName: string;
    businessUnit: string;
    department: string;
    officialEmail: string;
    designation: string;
    gender: string;
    role: string;
    dateOfJoining: string;
  }
  
  export interface UpdateUserPayload {
    employeeName?: string;
    designation?: string;
    password?: string;
  }


export const getUsers = async (): Promise<User[]> => {
  const response = await ApiService.get('/users');
  return response.data;
};

export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  const response = await ApiService.post('/users', userData);
  return response.data;
};

export const updateUser = async (id: string, userData: UpdateUserPayload): Promise<User> => {
  const response = await ApiService.patch(`/users/${id}`, userData);
  return response.data;
};