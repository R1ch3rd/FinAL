import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const StockAnalysisPage = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);

  // Fetch stock data from FastAPI backend
  useEffect(() => {
    axios.get(`http://localhost:8000/stock/${symbol}`)
      .then(response => {
        const formattedData = Object.keys(response.data).map(date => ({
          date,
          price: response.data[date],
        }));
        setStockData(formattedData);
      })
      .catch(error => console.error('Error fetching stock data:', error));
  }, [symbol]);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-4xl font-bold mb-6">Stock Analysis for {symbol}</h2>
      <div className="bg-gray-800 p-6 rounded shadow-md">
        <p className="text-xl">LSTM Prediction: <span className="text-green-400">$145.23</span></p>
        <p className="text-xl">Sentiment Analysis: <span className="text-green-400">Positive</span></p>
      </div>

      <div className="bg-gray-800 p-6 rounded shadow-md mt-6">
        <h3 className="text-2xl mb-4">Stock Price Chart</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={stockData}>
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockAnalysisPage;
