import React, { useState } from 'react';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    "Hello! How can I assist you with your finances today?",
  ]);

  const handleSend = async () => {
    if (message.trim() !== '') {
      // Add user's message to the chat
      setMessages([...messages, message]);
      setMessage('');

      try {
        // API call to send the message and get the response
        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }), // Send the user message
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Assuming the response is an array and we want to display the first message
        if (data.length > 0) {
          const botMessage = (
            <div className="bg-gray-700 p-2 rounded-lg mb-2">
              <p className="font-bold">Transaction Details:</p>
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="border-b border-gray-600 p-1">Amount:</td>
                    <td className="border-b border-gray-600 p-1">{data[0].amount}</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-600 p-1">Type:</td>
                    <td className="border-b border-gray-600 p-1">{data[0].credit_or_debit}</td>
                  </tr>
                  <tr>
                    <td className="border-b border-gray-600 p-1">Category:</td>
                    <td className="border-b border-gray-600 p-1">{data[0].category}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
          setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot's response to chat
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [...prevMessages, "Sorry, something went wrong."]); // Error message
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex flex-col">
      <h2 className="text-4xl font-bold mb-6 text-center">Chat with FinBot</h2>
      <div className="border border-gray-700 rounded-lg p-4 mb-6 h-96 overflow-y-auto bg-gray-800 shadow-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'} p-2 rounded`}>
            {typeof msg === 'string' ? msg : msg}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          className="flex-grow bg-gray-700 border border-gray-600 p-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button
          className="bg-blue-600 px-6 py-3 ml-3 rounded-lg text-white hover:bg-blue-500 transition duration-300"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
