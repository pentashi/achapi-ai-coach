import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChatWithCoach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message = input) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: message }]);

    fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { sender: 'coach', text: data.reply }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'coach', text: 'Sorry, something went wrong.' },
        ]);
      });

    setInput('');
  };

  return (
    <div className="container py-4" style={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      <div className="card shadow bg-dark text-white border-0 mb-3" style={{ minHeight: '70vh' }}>
        <div className="card-body overflow-auto" style={{ maxHeight: '70vh' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
            >
              <div
                className={`rounded px-3 py-2 ${msg.sender === 'user' ? 'bg-info text-dark' : 'bg-secondary'}`}
                style={{ maxWidth: '80%', wordBreak: 'break-word', fontSize: '1rem' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        className="input-group"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="form-control bg-dark text-white border-info"
          placeholder="Ask your coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-info fw-bold">
          Send
        </button>
      </form>
    </div>
  );
}
