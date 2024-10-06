import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl text-white font-bold mb-6 animate-fadeIn">Manage Your Finances with Ease</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        FinAL helps you track your monthly expenses and analyze stock trends using AI and sentiment analysis.
      </p>
      <div className="flex space-x-4">
        <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Get Started
        </Link>
        <Link to="/stocks" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Explore Stocks
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
