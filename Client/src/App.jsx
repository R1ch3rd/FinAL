import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import DashboardPage from './components/DashboardPage';
import StockListPage from './components/StockListPage';
import StockAnalysisPage from './components/StockAnalysisPage';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/stocks" element={<StockListPage />} />
          <Route path="/stock/:symbol" element={<StockAnalysisPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
