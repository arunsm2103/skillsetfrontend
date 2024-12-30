import ApiService from './api';

interface SkillAssessment {
  skillId: string;
  currentLevel: string;
  certificationName: string;
  certificationUrl: string;
}

export const addSkillAssessment = async (data: SkillAssessment) => {
  try {
    const response = await ApiService.post('/skills/assessments', data);
    return response.data;
  } catch (error) {
    console.error('Error adding skill assessment:', error);
    throw error;
  }
}; 