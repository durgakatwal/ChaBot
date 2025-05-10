'use client';

import React, { useState } from 'react';
import { Layout, Input, Button, Card, Row, Col, Typography, Spin } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'; // ✅ Add this

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function Dashboard() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data = await response.json();
            if (data.answer) {
                setResponse(data.answer);
            } else {
                setResponse('No answer returned');
            }
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error occurred while fetching the response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Header style={{ background: '#001529', padding: '0 24px' }}>
                <Title level={3} style={{ color: 'white', lineHeight: '64px', marginBottom: 0 }}>
                    DChat
                </Title>
            </Header>

            <Content style={{ padding: '24px 50px' }}>
                <Row justify="center">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <Card style={{ marginBottom: 16 }}>
                            <form onSubmit={handleSendMessage}>
                                <TextArea
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask something..."
                                    style={{ marginBottom: 12 }}
                                />
                                <Button type="primary" htmlType="submit" loading={isLoading}>
                                    Send
                                </Button>
                            </form>
                        </Card>

                        {message && (
                            <Card style={{ marginBottom: 16 }}>
                                <UserOutlined /> <Text strong>You</Text>
                                <p>{message}</p>
                            </Card>
                        )}

                        {response && (
                            <Card>
                                <RobotOutlined /> <Text strong>Ollama</Text>
                                {/* ✅ Use ReactMarkdown to render the answer properly */}
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </Card>
                        )}

                        {isLoading && (
                            <Spin spinning={true} tip="Thinking..." style={{ marginTop: 20 }}>
                                <div style={{ minHeight: 50 }} />
                            </Spin>
                        )}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
