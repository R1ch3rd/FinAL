import React from 'react';
import { useParams } from 'react-router-dom';

const StockAnalysisPage = () => {
  const { symbol } = useParams();

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-4xl font-bold mb-6">Stock Analysis for {symbol}</h2>
      <div className="bg-gray-800 p-6 rounded shadow-md">
        <p className="text-xl">LSTM Prediction: <span className="text-green-400">$145.23</span></p>
        <p className="text-xl">Sentiment Analysis: <span className="text-green-400">Positive</span></p>
      </div>
    </div>
  );
};

export default StockAnalysisPage;
