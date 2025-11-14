import React, { useState } from 'react';
import axios from 'axios';

export default function() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendToAI = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:8000/ai/chat', { message: input });
      const aiMessage = { role: 'ai', content: res.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { role: 'ai', content: 'AI Error: ' + err.message };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', padding: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI..."
          style={{ flex: 1, padding: '5px' }}
          onKeyPress={(e) => e.key === 'Enter' && sendToAI()}
        />
        <button onClick={sendToAI} style={{ marginLeft: '10px' }}>Send</button>
      </div>
    </div>
  );
}
