import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StockListPage = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const stocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  const favoriteStocks = [
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'NFLX', name: 'Netflix' },
    { symbol: 'NVDA', name: 'NVIDIA' },
  ];

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/stock/${searchInput.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      {/* <h2 className="text-3xl mb-4">Stocks List</h2> */}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <input
          type="text"
          className="p-2 rounded bg-gray-800 text-white w-full"
          placeholder="Enter stock ticker (e.g., AAPL)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 p-2 bg-green-600 rounded hover:bg-green-500 w-full"
        >
          Search Stock
        </button>
      </form>

      {/* Stock List
      <ul className="mb-8">
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
      </ul> */}

      {/* Favorite Stocks Section */}
      <div>
        <h3 className="text-2xl mb-4 text-center font-bold">Favorite Stocks</h3>
        <ul>
          {favoriteStocks.map((stock) => (
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
    </div>
  );
};

export default StockListPage;
