'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/use-auth';
import { LoginFormData } from '../schemas/auth.schema';

const { Title, Text } = Typography;

export const LoginForm = () => {
  const { login, loading } = useAuth();
  const [form] = Form.useForm<LoginFormData>();

  const onFinish = (values: LoginFormData) => {
    login(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <Card 
        className="w-full max-w-md shadow-2xl rounded-3xl border-0 overflow-hidden"
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <LockOutlined className="text-3xl text-white" />
          </div>
          <Title level={2} className="!mb-2 !font-bold !text-gray-800 tracking-tight">
            Chào mừng trở lại
          </Title>
          <Text type="secondary" className="text-sm">
            Vui lòng đăng nhập vào tài khoản của bạn để tiếp tục
          </Text>
        </div>

        <Form
          form={form}
          name="login_form"
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400 mr-2" />} 
              placeholder="Email" 
              className="rounded-xl px-4 py-3 bg-gray-50 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:bg-white transition-all text-base"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400 mr-2" />}
              placeholder="Mật khẩu"
              className="rounded-xl px-4 py-3 bg-gray-50 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:bg-white transition-all text-base"
            />
          </Form.Item>

          <Form.Item className="mt-8 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
              loading={loading}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
