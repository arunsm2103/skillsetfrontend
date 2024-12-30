'use client';

import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import ApiService from '@/services/api';
import AuthLayout from '@/components/auth/AuthLayout';
import Image from 'next/image';

const { Step } = Steps;

export default function ForgotPassword() {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [form] = Form.useForm();
  const router = useRouter();

  const steps = [
    {
      title: 'Email',
      content: 'Enter your email',
    },
    {
      title: 'Verify',
      content: 'Enter OTP',
    },
    {
      title: 'Reset',
      content: 'Set new password',
    },
  ];

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      await ApiService.post('/auth/forgot-password', { email: values.email });
      setEmail(values.email);
      message.success('OTP sent to your email');
      setCurrentStep(1);
    } catch  {
      message.error('Failed to send OTP. Please try again.');
    }
  };

  const handleOTPVerification = async (values: { otp: string }) => {
    try {
      const response = await ApiService.post('/auth/verify-otp', {
        email,
        otp: values.otp,
      });
      setResetToken(response.data.token);
      message.success('OTP verified successfully');
      setCurrentStep(2);
    } catch  {
      message.error('Invalid or expired OTP');
    }
  };

  const handlePasswordReset = async (values: { newPassword: string; confirmPassword: string }) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error('Passwords do not match');
        return;
      }

      await ApiService.post('/auth/reset-password', {
        token: resetToken,
        newPassword: values.newPassword,
      });

      message.success('Password reset successful');
      router.push('/login');
    } catch  {
      message.error('Failed to reset password');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} onFinish={handleEmailSubmit}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form form={form} onFinish={handleOTPVerification}>
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: 'Please enter the OTP' },
                { len: 6, message: 'OTP must be 6 digits' },
              ]}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="Enter 6-digit OTP"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <Form form={form} onFinish={handlePasswordReset}>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 8, message: 'Password must be at least 8 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
      <Image
          src="/company-logo.png"
          alt="Logo"
          width={80}
          height={40}
          className="mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-800">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {steps[currentStep].content}
        </p>
      </div>

      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      {renderStepContent()}

      <div className="mt-4 text-center">
        <Button type="link" onClick={() => router.push('/login')}>
          Back to Login
        </Button>
      </div>
    </AuthLayout>
  );
} 