import React, { useState } from 'react';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    "Hello! How can I assist you with your finances today?",
  ]);

  const handleSend = () => {
    if (message.trim() !== '') {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-3xl mb-4">Chat with FinBot</h2>
      <div className="border border-gray-700 rounded p-4 mb-4 h-80 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">{msg}</p>
        ))}
      </div>
      <div className="flex">
        <input 
          className="flex-grow bg-gray-800 border-none p-2 text-white rounded" 
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button 
          className="bg-blue-600 px-4 py-2 ml-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
