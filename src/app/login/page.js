'use client';
import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { supabase } from '/src/app/lib/supabase';
import { LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      message.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      message.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center' }}><LoginOutlined /> Login</Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <Text>Don&apos;t have an account? </Text>
        <a href="/register">Register here</a>
      </div>
    </div>
  );
};

export default LoginPage;
