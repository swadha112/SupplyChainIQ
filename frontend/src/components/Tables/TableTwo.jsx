import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch suppliers from the backend API
    const fetchSuppliers = async () => {
      try {
        console.log('Attempting to fetch suppliers...');
        const response = await axios.get('http://localhost:5050/api/suppliers');
        console.log('Suppliers fetched successfully:', response.data);
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching suppliers');
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Suppliers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Supplier ID</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Category</th>
            <th style={headerStyle}>Performance</th>
            <th style={headerStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{supplier.supplier_id}</td>
              <td style={cellStyle}>{supplier.name}</td>
              <td style={cellStyle}>{supplier.category}</td>
              <td style={{ ...cellStyle, ...getPerformanceStyle(supplier.performance) }}>
                {supplier.performance}
              </td>
              <td style={cellStyle}>{new Date(supplier.last_order_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

// Function to return style based on the performance value
const getPerformanceStyle = (performance) => {
  if (performance > 90) {
    return { color: 'green', fontWeight: 'bold' };
  } else if (performance >= 80 && performance <= 90) {
    return { color: 'orange', fontWeight: 'bold' };
  } else if (performance < 80) {
    return { color: 'red', fontWeight: 'bold' };
  }
  return {};
};

export default Suppliers;
