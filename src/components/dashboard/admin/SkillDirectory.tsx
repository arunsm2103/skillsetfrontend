import React, { useState, useEffect } from 'react';
import AddSkillModal from './AddSkillModal';
import { getSkillDirectory, addSkill, Skill } from '@/services/dashboardService';
import { EditOutlined } from '@ant-design/icons';
import { showToast } from '@/utils/toast';

const SkillDirectory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkillDirectory();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      showToast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (skillData: { 
    name: string; 
    description: string; 
    category: string; 
    expectedLevel: string 
  }) => {
    try {
      await addSkill(skillData);
      await fetchSkills();
      showToast.success('Skill added successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      showToast.error('Failed to add skill');
    }
  };

  const handleEditClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[450px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skill Directory</h2>
        <button
          onClick={() => {
            setSelectedSkill(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Skill Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                 Expected Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Employees Tracked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map((skill) => (
                <tr key={skill.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{skill.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{skill.expectedLevel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {skill?.employeeTrack}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(skill)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EditOutlined className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSkill(null);
        }}
        onSubmit={handleAddSkill}
        initialData={selectedSkill}
      />
    </div>
  );
};

export default SkillDirectory; 