"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ApiService from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await ApiService.post(ENDPOINTS.LOGIN, {
        employeeCode: values.username,
        password: values.password,
      });
      
      if (response.status === 201) {
        const data = response.data;
        login(data);
        document.cookie = `access_token=${data.access_token}; path=/`;
        message.success('Login successful');
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
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
          Sign in to your account
        </h2>
      </div>

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Username"
            className="h-12 rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            className="h-12 rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none rounded-lg text-lg font-medium"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form.Item>

        <div className="text-center">
          <Button 
            type="link" 
            onClick={() => router.push('/forgot-password')}
            className="text-blue-600 hover:text-blue-700"
          >
            Forgot Password?
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}
