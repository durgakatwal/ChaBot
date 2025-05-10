'use client';
import { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { supabase } from '/src/app/lib/supabase';
import { UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; //  Import router(when the registration is completed it automatically redirect to the login page)

const { Title } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const onFinish = async (values) => {
    setLoading(true);
    const { firstName, lastName, address, city, email, phone, password } = values;

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const { error: dbError } = await supabase.from('registrations').insert([
        {
          FirstName: firstName,
          LastName: lastName,
          address,
          city,
          email,
          phone,
        },
      ]);

      if (dbError) throw dbError;

      message.success('Registration successful! Please check your email to confirm.');

      //  Redirect to login page
      router.push('/login');
    } catch (error) {
      message.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        <UserAddOutlined /> Register
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input placeholder="Address" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: 'Please enter your city' }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
