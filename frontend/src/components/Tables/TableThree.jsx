import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch inventory items from the backend API
    const fetchInventory = async () => {
      try {
        console.log('Attempting to fetch inventory items...');
        const response = await axios.get('http://localhost:5050/api/inventory');
        console.log('Inventory fetched successfully:', response.data);
        setInventory(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

  // Filter items that need immediate restocking
  const itemsToRestock = inventory.filter(item => item.in_stock <= item.reorder_level);

  // Prepare data for the chart
  const chartData = {
    labels: inventory.map(item => item.name),
    datasets: [
      {
        label: 'In Stock',
        data: inventory.map(item => item.in_stock),
        backgroundColor: 'rgba(75, 192, 192, 1.2)',
      },
      {
        label: 'Reorder Level',
        data: inventory.map(item => item.reorder_level),
        backgroundColor: '#89f766',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory vs Reorder Level',
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Product ID</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Category</th>
            <th style={headerStyle}>In Stock</th>
            <th style={headerStyle}>Reorder Level</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{item.product_id}</td>
              <td style={cellStyle}>{item.name}</td>
              <td style={cellStyle}>{item.category}</td>
              <td style={{ ...cellStyle, ...getInStockStyle(item.in_stock, item.reorder_level) }}>
                {item.in_stock}
              </td>
              <td style={cellStyle}>{item.reorder_level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart for Inventory vs Reorder Level */}
      <div style={{ marginTop: '40px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Products that need immediate restocking */}
      <div style={{ marginTop: '40px' }}>
        <h3>Products that need immediate restocking</h3>
        {itemsToRestock.length > 0 ? (
          <ul>
            {itemsToRestock.map(item => (
              <li key={item._id}>
                {item.name} - In Stock: {item.in_stock}, Reorder Level: {item.reorder_level}
              </li>
            ))}
          </ul>
        ) : (
          <p>All products are sufficiently stocked.</p>
        )}
      </div>
    </div>
  );
};

// Styles for table header
const headerStyle = {
  borderBottom: '2px solid #000',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

// Styles for table cells
const cellStyle = {
  padding: '10px',
  textAlign: 'left',
};

// Function to return style based on the in-stock value
const getInStockStyle = (inStock, reorderLevel) => {
  if (inStock <= reorderLevel) {
    return { color: 'red', fontWeight: 'bold' }; // Critical level
  } else if (inStock <= reorderLevel * 2) {
    return { color: 'orange', fontWeight: 'bold' }; // Warning level
  } else {
    return { color: 'green', fontWeight: 'bold' }; // Sufficient stock
  }
};

export default Inventory;
