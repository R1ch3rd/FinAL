// AuthContext.jsx — demo authentication.
// The original app authenticated against Firebase; the public demo
// accepts any credentials and keeps the session in localStorage.
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const KEY = "final-demo-user";

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const login = (email) => {
    const u = { email, demo: true };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return Promise.resolve(u);
  };

  const signUp = login;

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
