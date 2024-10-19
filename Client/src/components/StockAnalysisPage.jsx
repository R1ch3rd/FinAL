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
      <div className="bg-gray-800 p-6 rounded shadow-md">
        {/* Display LSTM predictions */}
        <p className="text-xl">
          LSTM Predictions for the Next 7 Days:
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <ul className="text-green-400">
              {predictions.length > 0 ? (
                predictions.map((pred, index) => (
                  <li key={index}>Day {index + 1}: ${pred}</li>
                ))
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          )}
        </p>

        {/* Display either the sentiment or the error message */}
        <p className="text-xl mt-4">
          Sentiment Analysis:&nbsp;
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : (
            <span className={sentiment === 'Negative' ? 'text-red-400' : 'text-green-400'}>
      {sentiment || 'Loading...'}</span>
          )}
        </p>
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
