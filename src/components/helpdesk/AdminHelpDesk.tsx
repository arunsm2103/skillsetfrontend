'use client';

import React, { useState, useEffect } from 'react';
import { getTickets, updateTicket } from '@/services/helpdeskService';
import { Tag, Select, Input, message, Card, Statistic } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  SyncOutlined, 
  CloseCircleOutlined, 
  EditOutlined
} from '@ant-design/icons';
import dynamic from 'next/dynamic';

const AgGridWrapper = dynamic(() => import('../AgGridWrapper'), { ssr: false });
const { TextArea } = Input;

interface SubmittedBy {
  employeeName: string;
  role: string;
}

interface Query {
  id: string;
  submittedBy: SubmittedBy;
  status: string;
  priority: string;
  assignedAdmin: string | null;
  description: string;
  queryType: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  ticketId: string;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'blue';
    case 'in-progress':
      return 'orange';
    case 'resolved':
      return 'green';
    case 'closed':
      return 'gray';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'default';
  }
};

export default function AdminHelpDesk() {
  const [tickets, setTickets] = useState<Query[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Query | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState<{
    status: string;
    adminNotes: string;
  }>({
    status: '',
    adminNotes: ''
  });

  const columnDefs = [
    { field: 'ticketId', headerName: 'Ticket ID', flex: 1 },
    { 
      field: 'submittedBy',
      headerName: 'Submitted By',
      flex: 1.5,
      cellRenderer: (params: { value: { employeeName: string; role: string } }) => `${params.value.employeeName} (${params.value.role})`
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      cellRenderer: (params: { value: string }) => (
        <Tag color={getStatusColor(params.value)}>{params.value.toUpperCase()}</Tag>
      )
    },
    { 
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      cellRenderer: (params: { value: string }) => (
        <Tag color={getPriorityColor(params.value)}>{params.value.toUpperCase()}</Tag>
      )
    },
    { 
      field: 'assignedAdmin',
      headerName: 'Assigned Admin',
      flex: 1.5,
      valueFormatter: (params: { value: string | null }) => params.value || 'Unassigned'
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: { data: Query }) => (
           <button
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            onClick={() => handleUpdateClick(params.data)}
          >
            <EditOutlined />
          </button>
      ),
      width: 120,
      suppressSizeToFit: true
    }
  ];  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const allTickets = await getTickets();
      setTickets(allTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleUpdateClick = (ticket: Query) => {
    setSelectedTicket(ticket);
    setUpdateForm({
      status: ticket.status,
      adminNotes: ticket.adminNotes || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      await updateTicket(selectedTicket.id, {
        status: updateForm.status,
        adminNotes: updateForm.adminNotes
      });
      message.success('Ticket updated successfully');
      setShowUpdateModal(false);
      fetchAllTickets();
    } catch (error) {
      message.error('Failed to update ticket');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="py-5">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Help Desk Administration</h1>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <Statistic
                title="Open Tickets"
                value={tickets.filter(t => t.status === 'open').length}
                prefix={<ClockCircleOutlined className="text-blue-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="In Progress"
                value={tickets.filter(t => t.status === 'in_progress').length}
                prefix={<SyncOutlined className="text-orange-500" spin/> }
              />
            </Card>
            <Card>
              <Statistic
                title="Resolved"
                value={tickets.filter(t => t.status === 'resolved').length}
                prefix={<CheckCircleOutlined className="text-green-500" />}
              />
            </Card>
            <Card>
              <Statistic
                title="Closed"
                value={tickets.filter(t => t.status === 'closed').length}
                prefix={<CloseCircleOutlined className="text-gray-500" />}
              />
            </Card>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded">
            <h2 className="text-lg font-medium text-gray-800 mb-3">All Support Tickets</h2>
            <div className="ag-theme-alpine rounded overflow-hidden" style={{ height: 600, width: '100%' }}>
              <AgGridWrapper 
                rowData={tickets} 
                columnDefs={columnDefs} 
                pagination={true} 
                paginationPageSize={15} 
                rowHeight={50} 
                headerHeight={40} 
              />
            </div>
          </div>
        </div>

        {/* Enhanced Update Modal */}
        {showUpdateModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Update Ticket #{selectedTicket.ticketId}</h2>
              </div>
              
              <div className="p-4">
                {/* Ticket Details Section */}
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Submitted By</label>
                      <p className="font-medium">{selectedTicket.submittedBy.employeeName}</p>
                      <p className="text-sm text-gray-500">{selectedTicket.submittedBy.role}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Query Type</label>
                      <p className="font-medium">{selectedTicket.queryType}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Priority</label>
                      <Tag color={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority.toUpperCase()}
                      </Tag>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Created At</label>
                      <p className="font-medium">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedTicket.description}</p>
                  </div>
                </div>

                {/* Admin Response Section */}
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-gray-900">Admin Response</h3>
                  
                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Update Status</label>
                    <Select
                      value={updateForm.status}
                      onChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}
                      className="w-full"
                    >
                      <Select.Option value="open">
                        <Tag color="blue">OPEN</Tag>
                      </Select.Option>
                      <Select.Option value="in_progress">
                        <Tag color="orange">IN PROGRESS</Tag>
                      </Select.Option>
                      <Select.Option value="resolved">
                        <Tag color="green">RESOLVED</Tag>
                      </Select.Option>
                      <Select.Option value="closed">
                        <Tag color="gray">CLOSED</Tag>
                      </Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 block mb-1">Admin Notes</label>
                    <TextArea
                      value={updateForm.adminNotes}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                      rows={4}
                      placeholder="Add your response or notes here..."
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      These notes will be visible to the employee who submitted the ticket.
                    </p>
                  </div>

                  {/* Previous Admin Notes if any */}
                  {selectedTicket.adminNotes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm text-gray-500 block mb-1">Previous Admin Notes</label>
                      <p className="text-gray-700">{selectedTicket.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <button 
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTicket}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                >
                  Update Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 