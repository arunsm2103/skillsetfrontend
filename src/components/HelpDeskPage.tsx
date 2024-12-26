'use client';

import React, { useState, useEffect } from 'react';
import { getTickets, addTicket } from '@/services/helpdeskService';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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

ModuleRegistry.registerModules([AllCommunityModule]);

const HelpDeskPage = () => {
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
      cellRenderer: (params: any) => {
        return `${params.value.employeeName} (${params.value.role})`;
      }
    },
    { field: 'status', headerName: 'Status', flex: 1 },
    { 
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      cellStyle: (params: any) => {
        const color = getPriorityColor(params.value);
        return { color: color.replace('text-', '').replace('-600', '') };
      }
    },
    { 
      field: 'assignedAdmin.employeeName',
      headerName: 'Assigned Admin',
      flex: 1.5,
      valueFormatter: (params: any) => params.value || 'Unassigned'
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRendererFramework: (params: any) => (
        <button
          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md"
          onClick={() => handleViewQuery(params.data)}
        >
          View
        </button>
      ),
      width: 120, // Set a fixed width for this column
      suppressSizeToFit: true // Prevent resizing for the "Actions" column
    }
  ];
  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = await getTickets();
        setQueries(tickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };

    fetchTickets();
  }, []);

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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Help Desk</h1>

      {/* Submit a Query Form */}
      <form onSubmit={handleSubmitQuery} className="mb-6 max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Query Type</label>
          <select
            name="queryType"
            value={formData.queryType}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select a type</option>
            <option>Technical Issue</option>
            <option>Skill Level Update</option>
            <option>Permission Issue</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            rows={3}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit Query</button>
      </form>

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={queries}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          theme="legacy"
        />
      </div>

      {/* Query Details Modal */}
      {showModal && selectedQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-4">Query Details</h2>
            <div className="space-y-3">
              <p><strong>Ticket ID:</strong> {selectedQuery.id}</p>
              <p><strong>Query Type:</strong> {selectedQuery.queryType}</p>
              <p><strong>Description:</strong> {selectedQuery.description}</p>
              <p><strong>Submitted By:</strong> {selectedQuery.submittedBy.employeeName} ({selectedQuery.submittedBy.role})</p>
              <p><strong>Status:</strong> <span className="capitalize">{selectedQuery.status}</span></p>
              <p><strong>Priority:</strong> <span className={`${getPriorityColor(selectedQuery.priority)} capitalize`}>{selectedQuery.priority}</span></p>
              <p><strong>Assigned Admin:</strong> {selectedQuery.assignedAdmin || 'Unassigned'}</p>
              <p><strong>Admin Notes:</strong> {selectedQuery.adminNotes || 'No notes available'}</p>
              <p><strong>Created:</strong> {new Date(selectedQuery.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedQuery.updatedAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDeskPage;