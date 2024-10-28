import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <h1 className='text-3xl px-2 py-1 bg-gradient-to-b from-green-500 via-purple-500 to-blue-500 rounded-lg text-white font-bold'>
            FinAI
        </h1>
      </Link>
        <ul className="flex space-x-4">
          <li>
            <Link className="text-gray-300 hover:text-white text-xl" to="/">Home</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white text-xl" to="/chat">Chat</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white text-xl" to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white text-xl" to="/stocks">Stocks</Link>
          </li>
          {!user ? (
            <li>
              <Link className="bg-green-500 p-2 rounded-lg text-gray-100 hover:text-white text-xl" to="/login">Login</Link>
            </li>
          ) : (
          <li>
              <Link><button onClick={handleLogout} className="bg-red-500 p-0.5 rounded-lg text-gray-100 hover:text-white text-xl">
                Logout
              </button></Link>
            </li>)}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
