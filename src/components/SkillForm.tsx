'use client';

import React from 'react';
import { Form, Input, Select, Modal } from 'antd';
import { MasterSkill } from '@/services/dashboardService';

interface SkillFormProps {
  availableSkills: MasterSkill[];
  onSubmit: (values: {
    skillId: string;
    currentLevel: string;
    certificationName: string;
    certificationUrl: string;
  }) => void;
  onCancel: () => void;
  loading: boolean;
}

const { Option } = Select;

const SkillForm: React.FC<SkillFormProps> = ({
  availableSkills,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Add Skill Assessment"
      open={true}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="skillId"
          label="Select Skill"
          rules={[{ required: true, message: 'Please select a skill' }]}
        >
          <Select 
            placeholder="Select a skill"
            showSearch
            optionFilterProp="children"
          >
            {availableSkills.map(skill => (
              <Option key={skill.id} value={skill.id}>
                {skill.name} ({skill.category})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="currentLevel"
          label="Current Level"
          rules={[{ required: true, message: 'Please select your current level' }]}
        >
          <Select placeholder="Select your current level">
            <Option value="Beginner">Beginner</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
            <Option value="Expert">Expert</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="certificationName"
          label="Certification Name"
          rules={[{ required: true, message: 'Please enter certification name' }]}
        >
          <Input placeholder="Enter certification name" />
        </Form.Item>

        <Form.Item
          name="certificationUrl"
          label="Certification URL"
          rules={[
            { required: true, message: 'Please enter certification URL' },
            { type: 'url', message: 'Please enter a valid URL' }
          ]}
        >
          <Input placeholder="Enter certification URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SkillForm; 