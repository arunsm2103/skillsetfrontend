import { Skill } from '@/services/dashboardService';
import React, { useState, useEffect } from 'react';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (skillData: { name: string; description: string; category: string; expectedLevel: string }) => void;
  initialData?: Skill | null;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [skillData, setSkillData] = useState({
    name: '',
    description: '',
    category: '',
    expectedLevel: 'Intermediate'
  });

  useEffect(() => {
    if (initialData) {
      setSkillData({
        name: initialData.name,
        description: initialData.description,
        category: initialData.category,
        expectedLevel: initialData.expectedLevel
      });
    } else {
      setSkillData({
        name: '',
        description: '',
        category: '',
        expectedLevel: 'Intermediate'
      });
    }
  }, [initialData]);

  const expectedLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(skillData);
    setSkillData({ name: '', description: '', category: '', expectedLevel: 'Intermediate' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skill Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={skillData.name}
                onChange={(e) => setSkillData({ ...skillData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={skillData.category}
                onChange={(e) => setSkillData({ ...skillData, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expected Level
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={skillData.expectedLevel}
                onChange={(e) => setSkillData({ ...skillData, expectedLevel: e.target.value })}
              >
                {expectedLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={skillData.description}
                onChange={(e) => setSkillData({ ...skillData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal; 