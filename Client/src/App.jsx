import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import DashboardPage from './components/DashboardPage';
import StockListPage from './components/StockListPage';
import StockAnalysisPage from './components/StockAnalysisPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stocks" element={<StockListPage />} />
          <Route path="/stock/:symbol" element={<StockAnalysisPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
