import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center relative" style={{ backgroundImage: "url('https://i.pinimg.com/enabled_lo/564x/9e/37/cf/9e37cf2316e5291aded39885086a47f3.jpg')"}}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create Your Account</h2>
        <p className="text-center text-gray-500">Sign up to start managing your finances</p>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500 transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-green-600 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
