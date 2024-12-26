export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/users/login`,
  register: `${API_BASE_URL}/users/register`,
  designations: `${API_BASE_URL}/designations`,
  // Add other endpoints here as needed
}; 