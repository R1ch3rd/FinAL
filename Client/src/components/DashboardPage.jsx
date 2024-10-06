import React from 'react';

const DashboardPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <h2 className="text-4xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Monthly Expenses</h3>
          <p>Total: <span className="text-yellow-400">$1200</span></p>
          <p>Food: <span className="text-yellow-400">$400</span></p>
          <p>Rent: <span className="text-yellow-400">$500</span></p>
          <p>Miscellaneous: <span className="text-yellow-400">$300</span></p>
        </div>
        <div className="bg-gray-800 p-6 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4">Stock Portfolio</h3>
          <p>Value: <span className="text-green-400">$5000</span></p>
          <p>Gains: <span className="text-green-400">+5%</span></p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
