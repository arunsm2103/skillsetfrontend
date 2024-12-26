'use client';

import React, { useState, useEffect } from 'react';
import SkillForm from './SkillForm';

interface Skill {
  id: number;
  code: string;
  name: string;
  grade: string;
  otherInfo: string;
  date: string;
}

export default function SkillList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/skillsets');
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      console.log('Fetched skills:', data); // Debug log
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills');
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreateSkill = async (skillData: Partial<Skill>) => {
    try {
      console.log('Creating skill:', skillData); // Debug log
      const response = await fetch('http://localhost:3001/api/skillsets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });
      
      if (!response.ok) throw new Error('Failed to create skill');
      await fetchSkills();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating skill:', err);
      setError('Failed to create skill');
    }
  };

  const handleUpdateSkill = async (skillData: Partial<Skill>) => {
    if (!selectedSkill) return;
    try {
      const response = await fetch(`http://localhost:3001/api/skillsets/${selectedSkill.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      });
      
      if (!response.ok) throw new Error('Failed to update skill');
      await fetchSkills();
      setIsModalOpen(false);
      setSelectedSkill(undefined);
    } catch (err) {
      console.error('Error updating skill:', err);
      setError('Failed to update skill');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;
    await fetch(`http://localhost:3001/api/skillsets/${id}`, { method: 'DELETE' });
    fetchSkills();
  };

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Skill
      </button>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Grade</th>
            <th className="px-4 py-2">Other Info</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <tr key={skill.id}>
                <td className="border px-4 py-2">{skill.code}</td>
                <td className="border px-4 py-2">{skill.name}</td>
                <td className="border px-4 py-2">{skill.grade}</td>
                <td className="border px-4 py-2">{skill.otherInfo}</td>
                <td className="border px-4 py-2">{skill.date}</td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => { setSelectedSkill(skill); setIsModalOpen(true); }} 
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteSkill(skill.id)} 
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border px-4 py-2 text-center">
                No skills found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedSkill ? 'Edit Skill' : 'Create Skill'}
            </h2>
            <SkillForm
              skill={selectedSkill}
              onSubmit={selectedSkill ? handleUpdateSkill : handleCreateSkill}
              onCancel={() => { setIsModalOpen(false); setSelectedSkill(undefined); }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 