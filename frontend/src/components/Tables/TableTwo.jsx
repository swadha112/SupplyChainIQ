import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchSuppliers = async () => {
      try {
        console.log('Attempting to fetch orders...');
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

  if (loading) return <p>Loading ssupps...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>
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
          {suppliers.map((suppliers) => (
            <tr key={suppliers._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{suppliers.supplier_id}</td>
              <td style={cellStyle}>{suppliers.name}</td>
              <td style={cellStyle}>{suppliers.category}</td>
              <td style={cellStyle}>{suppliers.performance}</td>
              <td style={cellStyle}>{suppliers.last_order_date}</td>
              {/* <td style={{ ...cellStyle, ...getStatusStyle(order.status) }}>
                {order.status}
              </td>
              <td style={cellStyle}>${order.total}</td> */}
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
  backgroundColor: '#f2f2f2'
};

// Styles for table cells
const cellStyle = {
  padding: '10px',
  textAlign: 'left',
};

// Function to return style based on the status
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return { color: 'green', fontWeight: 'bold' };
    case 'shipped':
      return { color: 'orange', fontWeight: 'bold' };
    case 'processing':
      return { color: 'red', fontWeight: 'bold' };
    default:
      return {};
  }
};

export default Suppliers;
