'use client';

import { useState, useEffect, useRef } from 'react';

const Dashboard = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userId = 'test-user'; // or get it from Supabase session if needed
    const prompt = input;

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, prompt }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server responded with error:', res.status, errorText);
        throw new Error(`Failed to fetch response: ${errorText}`);
      }

      const data = await res.json();
      console.log('Response from OpenAI:', data);

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error in handleSubmit:', {
        message: error.message,
        stack: error.stack,
        error,
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble responding right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Chat Assistant</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Assistant: '}</strong>{msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>

      {loading && <p className="loading">Loading...</p>}

      <style jsx>{`
        .dashboard-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          color: #333;
        }

        .messages {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .message {
          margin: 10px 0;
        }

        .message.user {
          background-color: #d1ffd6;
          padding: 10px;
          border-radius: 5px;
          align-self: flex-end;
        }

        .message.assistant {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          align-self: flex-start;
        }

        form {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        input {
          width: 80%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
          outline: none;
        }

        input:focus {
          border-color: #4CAF50;
        }

        button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:disabled {
          background-color: #ccc;
        }

        button:hover {
          background-color: #45a049;
        }

        .loading {
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
