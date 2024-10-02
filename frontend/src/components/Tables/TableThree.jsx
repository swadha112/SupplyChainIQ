import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch inventory from the backend API
    const fetchInventory = async () => {
      try {
        console.log('Attempting to fetch inventory...');
        const response = await axios.get('http://localhost:5050/api/inventory');
        console.log('Inventory fetched successfully:', response.data);
        setInventory(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching inventory');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the chart
  const productNames = inventory.map(item => item.name);
  const inStockData = inventory.map(item => item.in_stock);
  const reorderLevelData = inventory.map(item => item.reorder_level);

  const chartData = {
    labels: productNames,
    datasets: [
      {
        label: 'In Stock',
        data: inStockData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Reorder Level',
        data: reorderLevelData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inventory</h2>

      {/* Table Format */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Product ID</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Category</th>
            <th style={headerStyle}>In Stock</th>
            <th style={headerStyle}>Reorder level</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{item.product_id}</td>
              <td style={cellStyle}>{item.name}</td>
              <td style={cellStyle}>{item.category}</td>
              <td style={cellStyle}>{item.in_stock}</td>
              <td style={cellStyle}>{item.reorder_level}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart Format */}
      <div style={{ marginTop: '40px' }}>
        <h3>In Stock vs Reorder Level</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

// Styles for table header
const headerStyle = {
  borderBottom: '2px solid #000',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2'
};

// Styles for table cells
const cellStyle = {
  padding: '10px',
  textAlign: 'left',
};

export default Inventory;
