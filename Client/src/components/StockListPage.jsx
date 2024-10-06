import React from 'react';
import { useNavigate } from 'react-router-dom';

const StockListPage = () => {
  const navigate = useNavigate();

  const stocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-3xl mb-4">Stocks List</h2>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.symbol} className="mb-2">
            <button 
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded w-full text-left"
              onClick={() => navigate(`/stock/${stock.symbol}`)}
            >
              {stock.name} ({stock.symbol})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockListPage;
