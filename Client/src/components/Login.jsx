// Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx"; // Using AuthContext for login
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center relative" style={{ backgroundImage: "url('https://i.pinimg.com/enabled_lo/564x/9e/37/cf/9e37cf2316e5291aded39885086a47f3.jpg')"}}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-ink">Welcome Back!</h2>
        <p className="text-center text-ink-faint">Log in to access your dashboard</p>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 bg-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-ink-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 text-sm border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-ink-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 text-sm border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-accent-btn rounded-lg hover:bg-accent focus:ring-4 focus:ring-accent transition duration-300 ease-in-out"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-ink-muted">
          Don’t have an account?{' '}
          <a href="/signup" className="font-medium text-accent-deep hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};
export default Login;