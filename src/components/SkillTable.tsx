import React, { useState } from 'react';
import { Table, Button } from 'antd';
import SkillForm from './SkillForm';

const SkillTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddSkill = () => {
    setIsModalVisible(true);
  };

  const handleSaveSkill = (data: any) => {
    console.log('Skill data:', data);
    // Logic to save the skill data
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Skills</h2>
        <Button type="primary" onClick={handleAddSkill}>
          Add Skill
        </Button>
      </div>
      <Table
        // Your table data and columns here
      />
      <SkillForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveSkill}
      />
    </div>
  );
};

export default SkillTable; 