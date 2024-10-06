import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-white font-bold">FinAL</h1>
        <ul className="flex space-x-4">
          <li>
            <Link className="text-gray-300 hover:text-white" to="/">Home</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white" to="/chat">Chat</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white" to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white" to="/stocks">Stocks</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
