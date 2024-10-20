import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const StockAnalysisPage = () => {
  const { symbol } = useParams();  // Get stock symbol from the URL
  const [sentiment, setSentiment] = useState('');  // Hold fetched sentiment
  const [predictions, setPredictions] = useState([]);  // Hold fetched LSTM predictions
  const [error, setError] = useState(null);  // For handling errors

  // Fetch sentiment data when the component mounts
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/analyze-sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stock_symbol: symbol
          }),
        });

        const data = await response.json();
        setSentiment(data.average_sentiment);  // Set the average sentiment
      } catch (err) {
        console.log(err);
        setError('Failed to fetch sentiment');
      }
    };

    const fetchPrediction = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticker: symbol
          }),
        });

        const data = await response.json();
        setPredictions(data.predictions.map(pred => pred.toFixed(2)));  // Set the LSTM predictions rounded to 2 decimal places
      } catch (err) {
        console.log(err);
        setError('Failed to fetch prediction');
      }
    };

    fetchSentiment();  // Fetch sentiment data on page load
    fetchPrediction();  // Fetch LSTM prediction on page load
  }, [symbol]);  // Dependency array ensures it runs when 'symbol' changes
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
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
  {/* LSTM Predictions */}
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-4">LSTM Predictions for the Next 7 Days</h2>
    {error ? (
      <p className="text-red-400 text-lg">{error}</p>
    ) : (
      <ul className="space-y-2">
        {predictions.length > 0 ? (
          predictions.map((pred, index) => (
            <li key={index} className="flex items-center text-lg text-green-400">
              <span className="mr-2 text-gray-300">Day {index + 1}:</span> 
              <span className="font-semibold">${pred}</span>
            </li>
          ))
        ) : (
          <li className="text-yellow-400 text-lg">Loading predictions...</li>
        )}
      </ul>
    )}
  </div>

  {/* Sentiment Analysis */}
  <div className="border-t border-gray-600 pt-6">
    <h2 className="text-2xl font-bold text-white mb-4">Sentiment Analysis</h2>
    {error ? (
      <p className="text-red-400 text-lg">{error}</p>
    ) : (
      <p className={`text-lg font-semibold ${sentiment === 'Negative' ? 'text-red-400' : 'text-green-400'}`}>
        {sentiment || 'Loading sentiment...'}
        {sentiment === 'Positive' ? (
          <span role="img" aria-label="positive" className="ml-2"></span>
        ) : sentiment === 'Negative' ? (
          <span role="img" aria-label="negative" className="ml-2"></span>
        ) : null}
      </p>
    )}
  </div>
</div>


<div className="bg-gray-800 p-6 rounded shadow-md mt-6">
  <h3 className="text-2xl mb-4 text-white">Stock Price Chart</h3>
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={stockData}>
      <XAxis dataKey="date" tick={{ fill: '#fff' }} axisLine={{ stroke: '#fff' }} />
      <YAxis domain={['auto', 'auto']} tick={{ fill: '#fff' }} axisLine={{ stroke: '#fff' }} />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="price" stroke="#82ca9d" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

      {/* <div className="bg-gray-800 p-6 rounded shadow-md mt-6">
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
      </div> */}
    </div>
  );
};

export default StockAnalysisPage;
