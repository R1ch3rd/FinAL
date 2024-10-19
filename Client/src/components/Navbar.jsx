import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <h1 className='px-2 py-1 bg-gradient-to-b from-green-500 via-purple-500 to-blue-500 rounded-lg text-white font-bold'>
            FinAL
        </h1>
      </Link>
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
