'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SkillFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Add Skill"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="skillName"
          label="Skill Name"
          rules={[{ required: true, message: 'Please enter a skill name' }]}
        >
          <Input placeholder="Enter skill name" />
        </Form.Item>
        <Form.Item
          name="currentLevel"
          label="Current Level"
          rules={[{ required: true, message: 'Please select a proficiency level' }]}
        >
          <Select placeholder="Select proficiency level">
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="certificationName"
          label="Certification Name"
          rules={[{ required: true, message: 'Please enter the certification name' }]}
        >
          <Input placeholder="Enter certification name" />
        </Form.Item>
        <Form.Item
          name="certificationAuthority"
          label="Certification Issuing Authority"
          rules={[{ required: true, message: 'Please enter the issuing authority' }]}
        >
          <Input placeholder="Enter issuing authority" />
        </Form.Item>
        <Form.Item
          name="dateOfIssue"
          label="Date of Issue"
          rules={[{ required: true, message: 'Please select the date of issue' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="certificate"
          label="Upload Certificate"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload name="certificate" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SkillForm; 