'use client';

import React, { useState, useEffect } from 'react';
import { getTickets, addTicket } from '@/services/helpdeskService';
import { useAuth } from '@/contexts/AuthContext';
import { Tag } from 'antd';
import dynamic from 'next/dynamic';
import { EyeOutlined } from '@ant-design/icons';

const AgGridWrapper = dynamic(() => import('../AgGridWrapper'), { ssr: false });

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

export default function EmployeeHelpDesk() {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ queryType: '', description: '', priority: 'low' });

  const columnDefs = [
    { field: 'ticketId', headerName: 'Ticket ID', flex: 1 },
    { 
      field: 'submittedBy',
      headerName: 'Submitted By',
      flex: 1.5,
      cellRenderer: (params: any) => `${params.value.employeeName} (${params.value.role})`
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      cellRenderer: (params: any) => (
        <Tag color={getStatusColor(params.value)}>{params.value.toUpperCase()}</Tag>
      )
    },
    { 
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      cellRenderer: (params: any) => (
        <Tag color={getPriorityColor(params.value)}>{params.value.toUpperCase()}</Tag>
      )
    },
    { 
      field: 'assignedAdmin',
      headerName: 'Assigned Admin',
      flex: 1.5,
      valueFormatter: (params: any) => params.value || 'Unassigned'
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: any) => (
        <button
          className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
          onClick={() => handleViewQuery(params.data)}
        >
          <EyeOutlined />
        </button>
      ),
      width: 120,
      suppressSizeToFit: true
    }
  ];

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const tickets = await getTickets();
      const filteredTickets = tickets.filter(
        (ticket: Query) => ticket.submittedBy.employeeName === user?.employeeName
      );
      setQueries(filteredTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTicket = await addTicket(formData);
      setQueries([...queries, newTicket]);
      setFormData({ queryType: '', description: '', priority: 'low' });
    } catch (error) {
      console.error('Failed to add ticket:', error);
    }
  };

  const handleViewQuery = (query: Query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'blue';
      case 'in-progress': return 'orange';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  return (
    <div className="py-5">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Help Desk Support</h1>
          
          <div className="bg-gray-50 p-4 rounded mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-3">Submit New Support Ticket</h2>
            <form onSubmit={handleSubmitQuery} className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Query Type</label>
                <select name="queryType" value={formData.queryType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select a type</option>
                  <option>Technical Issue</option>
                  <option>Skill Level Update</option>
                  <option>Permission Issue</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Priority Level</label>
                <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Please describe your issue..."></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors">Submit Ticket</button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded">
            <h2 className="text-lg font-medium text-gray-800 mb-3">My Support Tickets</h2>
            <div className="ag-theme-alpine rounded overflow-hidden" style={{ height: 600, width: '100%' }}>
              <AgGridWrapper 
                rowData={queries} 
                columnDefs={columnDefs} 
                pagination={true} 
                paginationPageSize={15} 
                rowHeight={50} 
                headerHeight={40} 
              />
            </div>
          </div>
        </div>

        {showModal && selectedQuery && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Ticket Details</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Ticket ID</p>
                    <p className="font-medium">{selectedQuery.ticketId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Query Type</p>
                    <p className="font-medium">{selectedQuery.queryType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{selectedQuery.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className={`font-medium ${getPriorityColor(selectedQuery.priority)} capitalize`}>{selectedQuery.priority}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{selectedQuery.description}</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500 mb-1">Submitted By</p>
                  <p className="text-gray-700">{selectedQuery.submittedBy.employeeName} ({selectedQuery.submittedBy.role})</p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500 mb-1">Admin Notes</p>
                  <p className="text-gray-700">{selectedQuery.adminNotes || 'No notes available'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t pt-3">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(selectedQuery.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(selectedQuery.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 