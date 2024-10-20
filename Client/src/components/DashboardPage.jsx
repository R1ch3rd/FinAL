import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'C:/Users/usaru/Desktop/ADL/FinAL/Client/firebase'; // Import your Firebase config
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const DashboardPage = () => {
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [error, setError] = useState(null);

  // Fetch transaction data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'transaction_info'));
        const data = querySnapshot.docs.map(doc => doc.data());

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
      } catch (err) {
        console.error("Error fetching transactions: ", err);
        setError('Failed to fetch transaction data');
      }
    };

    fetchData();
  }, []);

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
            categoryExpenses.map((category, index) => (
              <div key={index}>
                <p>Category: <span className="text-yellow-400">{category.name}</span></p>
                <p>Total: <span className="text-yellow-400">${category.value.toFixed(2)}</span></p>
              </div>
            ))
          ) : (
            <p className="text-yellow-400">Loading...</p>
          )}
        </div>
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Stock Portfolio</h3>
          <p>Value: <span className="text-green-400">$532.34</span></p>
          <p>Gains: <span className="text-green-400">+2.4%</span></p>
        </div>
      </div>
      <div className="mt-8 bg-gray-800 p-6 rounded shadow-md">
        <h3 className="text-2xl font-bold mb-4">Expenses Breakdown</h3>
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
              label
            >
              {categoryExpenses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} /> {/* Add the Legend component */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
