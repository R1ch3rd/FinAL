import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase config
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios'; // Ensure axios is installed

const DashboardPage = () => {
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  // Stock portfolio state
  const [stocks, setStocks] = useState([]); // Array of stocks
  const [symbol, setSymbol] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [message, setMessage] = useState('');

  // Fetch transaction data and stock portfolio from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionSnapshot = await getDocs(collection(db, 'transaction_info'));
        const data = transactionSnapshot.docs.map(doc => doc.data());

        // Group expenses by category and sum the amounts
        const expensesByCategory = data.reduce((acc, curr) => {
          const category = curr.category || 'Unknown';
          const amount = parseFloat(curr.amount); // Convert string to number

          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

        const formattedData = Object.keys(expensesByCategory).map(category => ({
          name: category,
          value: expensesByCategory[category],
        }));

        setCategoryExpenses(formattedData);
        setTransactions(data); // Store all transactions for later use

        // Fetch stock portfolio from Firestore
        const stockSnapshot = await getDocs(collection(db, 'stocks'));
        const stockData = stockSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStocks(stockData); // Set the stocks from Firestore

      } catch (err) {
        console.error("Error fetching transactions or stocks: ", err);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);
  const renderCustomizedLabel = ({ name, value, percent }) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`; // Format percentage with one decimal place
  };

  const handleCategoryClick = (data, index) => {
    const category = data.name; // Get the clicked category name
    const filteredTransactions = transactions.filter(transaction => transaction.category === category);
    setSelectedCategory({ category, transactions: filteredTransactions });
  };

  const handleAddStock = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await axios.get(`http://127.0.0.1:8000/stock/${symbol}`); // Adjust URL if needed
      const prices = response.data;
      const lastPrice = Object.values(prices).pop(); // Get the latest price

      const currentValue = lastPrice * (amountSpent / purchasePrice); // Calculate current value based on amount spent
      const gain = ((lastPrice - purchasePrice) / purchasePrice) * 100; // Calculate gain percentage

      const newStock = {
        symbol,
        amountSpent: parseFloat(amountSpent), // Ensure this is a number
        purchasePrice: parseFloat(purchasePrice), // Ensure this is a number
        currentValue,
        gain,
      };

      // Save the new stock to Firestore
      const docRef = await addDoc(collection(db, 'stocks'), newStock);
      setStocks(prevStocks => [...prevStocks, { id: docRef.id, ...newStock }]); // Update local state with Firestore id
      setMessage(`Stock ${symbol} added successfully!`);

      // Reset input fields
      setSymbol('');
      setAmountSpent('');
      setPurchasePrice('');
    } catch (err) {
      console.error("Error fetching stock data: ", err);
      setMessage('Failed to fetch stock data');
    }
  };

  const handleDeleteStock = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this stock?");

    if (confirmDelete) {
      try {
        // Delete stock from Firestore
        await deleteDoc(doc(db, 'stocks', id));

        // Update local state to remove the deleted stock
        setStocks(prevStocks => prevStocks.filter(stock => stock.id !== id));
        setMessage('Stock deleted successfully!');
      } catch (err) {
        console.error("Error deleting stock: ", err);
        setMessage('Failed to delete stock');
      }
    }
  };

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#FF4560'];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-4xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Monthly Expenses</h3>
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : categoryExpenses.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-600 p-2">Category</th>
                  <th className="border-b border-gray-600 p-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {categoryExpenses.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border-b border-gray-600 p-2 text-yellow-400">{category.name}</td>
                    <td className="border-b border-gray-600 p-2">${category.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-yellow-400">Loading...</p>
          )}
        </div>
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4 ">Stock Portfolio</h3>
          <form onSubmit={handleAddStock} className="mb-4">
            <input
              type="text"
              placeholder="Stock Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="p-2 rounded border border-gray-600 bg-gray-700 mb-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Amount Spent"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              className="p-2 rounded border border-gray-600 bg-gray-700 mb-2 w-full"
              required
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="p-2 rounded border border-gray-600 bg-gray-700 mb-4 w-full"
              required
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Add Stock
            </button>
          </form>
          {message && <p className="text-green-400">{message}</p>}
          <table className="w-full text-left border-collapse mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-600 p-2">Symbol</th>
                <th className="border-b border-gray-600 p-2">Amount Spent</th>
                <th className="border-b border-gray-600 p-2">Purchase Price</th>
                <th className="border-b border-gray-600 p-2">Current Value</th>
                <th className="border-b border-gray-600 p-2">Gains (%)</th>
                <th className="border-b border-gray-600 p-2">Actions</th> {/* Added Actions column */}
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-700">
                  <td className="border-b border-gray-600 p-2 text-yellow-400">{stock.symbol}</td>
                  <td className="border-b border-gray-600 p-2">${stock.amountSpent.toFixed(2)}</td>
                  <td className="border-b border-gray-600 p-2">${stock.purchasePrice.toFixed(2)}</td>
                  <td className="border-b border-gray-600 p-2">${stock.currentValue.toFixed(2)}</td>
                  <td className="border-b border-gray-600 p-2">{stock.gain.toFixed(2)}%</td>
                  <td className="border-b border-gray-600 p-2">
                    <button
                      onClick={() => handleDeleteStock(stock.id)} // Call delete function
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded shadow-md mt-6 w-full">
        <h3 className="text-2xl font-bold mb-4 text-center">Expense Distribution</h3>
        <div style={{ padding: '20px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryExpenses}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={renderCustomizedLabel} 
              onClick={handleCategoryClick} // Add this line to handle clicks
            >
              {categoryExpenses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer></div>
      </div>
      {/* Display Transactions Table if a category is selected */}
      {selectedCategory && (
        <div className="mt-8 bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Transactions for <span className="text-yellow-400">{selectedCategory.category}</span></h3>
          {selectedCategory.transactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-600 p-2">Date & Time</th>
                  <th className="border-b border-gray-600 p-2">Amount</th>
                  <th className="border-b border-gray-600 p-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {selectedCategory.transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border-b border-gray-600 p-2">
                      {new Date(transaction.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true // Set to false for 24-hour format
                      })}
                    </td>
                    <td className="border-b border-gray-600 p-2">${parseFloat(transaction.amount).toFixed(2)}</td>
                    <td className="border-b border-gray-600 p-2">{transaction.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-yellow-400">No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
