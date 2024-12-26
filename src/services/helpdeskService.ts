import ApiService from "./api";

export const getTickets = async (search?: string, status?: string, queryType?: string) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (queryType) params.append('queryType', queryType);

    const response = await ApiService.get('/helpdesk/tickets', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee overview:', error);
    throw error;
  }
};

export const addTicket = async (ticketData: { queryType: string; description: string; priority: string }) => {
  try {
    const response = await ApiService.post('/helpdesk/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
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