import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaWallet } from 'react-icons/fa'; // Importing icons

const LandingPage = () => {
  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center relative" style={{ backgroundImage: "url('https://i.pinimg.com/enabled_lo/564x/9e/37/cf/9e37cf2316e5291aded39885086a47f3.jpg')" }}>
      <div className="bg-black bg-opacity-60 p-10 rounded-lg flex flex-col items-center justify-center">
  <h1 className="text-6xl text-white font-bold mb-6 animate-fadeIn text-center">
    Manage Your Finances with Ease
  </h1>
  <p className="text-gray-300 mb-8 max-w-2xl text-center">
    FinAI helps you track your monthly expenses and analyze stock trends using AI and sentiment analysis.
  </p>
  <div className="flex space-x-4">
    <Link to="/dashboard" className="bg-gradient-to-b from-green-500 via-purple-500 to-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded transition duration-300 ease-in-out transform hover:scale-105">
      Get Started
    </Link>
    <Link to="/stocks" className="bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hover:bg-gray-700 text-white px-6 py-3 rounded transition duration-300 ease-in-out transform hover:scale-105">
      Explore Stocks
    </Link>
  </div>
</div>


<div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
  <div className="bg-black bg-opacity-60 shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105">
    <FaChartLine className="text-blue-500 text-5xl mb-4 mx-auto" />
    <h2 className="text-xl font-semibold mb-2 text-gray-100">Analyze Trends</h2>
    <p className="text-gray-100">Get insights on stock market trends using advanced AI algorithms.</p>
  </div>
  <div className="bg-black bg-opacity-60 shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105">
    <FaWallet className="text-green-500 text-5xl mb-4 mx-auto" />
    <h2 className="text-xl font-semibold mb-2 text-gray-100">Track Expenses</h2>
    <p className="text-gray-100">Easily track your monthly expenses and stay on top of your budget.</p>
  </div>
  <div className="bg-black bg-opacity-60 shadow-lg rounded-lg p-5 transition-transform transform hover:scale-105">
    <FaChartLine className="text-red-500 text-5xl mb-4 mx-auto" />
    <h2 className="text-xl font-semibold mb-2 text-gray-100">Sentiment Analysis</h2>
    <p className="text-gray-100">Utilize sentiment analysis on news articles to make informed investment decisions.</p>
  </div>
</div>


    </div>
  );
};

export default LandingPage;
