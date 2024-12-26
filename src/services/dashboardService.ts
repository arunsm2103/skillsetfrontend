import ApiService from "./api";

export const getEmployeeOverview = async () => {
  try {
    const response = await ApiService.get('/dashboard/employee/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee overview:', error);
    throw error;
  }
};

export const getSkillOverview = async () => {
  try {
    const response = await ApiService.get('/dashboard/skills/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching skill overview:', error);
    throw error;
  }
};

export const getEmployeeTickets = async () => {
  try {
    const response = await ApiService.get('/dashboard/employee/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee tickets:', error);
    throw error;
  }
};

export const getTeamSkills = async () => {
  try {
    const response = await ApiService.get('/dashboard/manager/team-skills');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee tickets:', error);
    throw error;
  }
};

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillAssessment {
  id: string;
  userId: string;
  skillId: string;
  currentLevel: string;
  expectedLevel: string;
  status: string;
  feedback: string | null;
  certificationName: string | null;
  certificationUrl: string | null;
  assessmentDate: string;
  skill: Skill;
}

export interface TeamMember {
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
  skillAssessments: SkillAssessment[];
  skillNames: string;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await ApiService.get('/dashboard/manager/team-members');
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

export const getDashboardMetrics = async () => {
  try {
    const response = await ApiService.get('/dashboard/admin/metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

export const getSkillDirectory = async (): Promise<Skill[]> => {
  try {
    const response = await ApiService.get('/dashboard/skill-directory');
    return response.data;
  } catch (error) {
    console.error('Error fetching skill directory:', error);
    throw error;
  }
};

interface AddSkillPayload {
  name: string;
  category: string;
  description: string;
  expectedLevel: string;
}

export const addSkill = async (skillData: AddSkillPayload): Promise<Skill> => {
  const response = await ApiService.post('/skills', {
   ...skillData
  });
  return response.data;
};

export interface EmployeeMatrix {
  name: string;
  role: string;
  department: string;
  skillAssessments: SkillAssessment[];
}

export const getEmployeeMatrix = async (): Promise<EmployeeMatrix[]> => {
  try {
    const response = await ApiService.get('/dashboard/admin/employee-matrix');
    return response.data;
  } catch (error) {
    console.error('Error fetching employee matrix:', error);
    throw error;
  }
};

export const updateTeamMemberSkill = async (
  memberId: string, 
  skillId: string, 
  expectedLevel: string
) => {
  try {
    const response = await ApiService.patch(`/users/team-members/${memberId}/skills/${skillId}`, {
      expectedLevel
    });
    return response.data;
  } catch (error) {
    console.error('Error updating skill level:', error);
    throw error;
  }
};