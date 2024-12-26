import ApiService from "./api";
import { ENDPOINTS } from './endpoints';

interface TicketUpdate {
  status: string;
  adminNotes: string;
}

export const getTickets = async () => {
  try {
    const response = await ApiService.get(ENDPOINTS.HELPDESK.GET_TICKETS);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const addTicket = async (ticketData: any) => {
  try {
    const response = await ApiService.post(ENDPOINTS.HELPDESK.ADD_TICKET, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId: string, updates: TicketUpdate) => {
  try {
    const response = await ApiService.patch(
      `/helpdesk/tickets/${ticketId}`, 
      updates
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error);
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