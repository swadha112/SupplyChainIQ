import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchLogistics = async () => {
      try {
        console.log('Attempting to fetch orders...');
        const response = await axios.get('http://localhost:5050/api/logistics');
        console.log('Orders fetched successfully:', response.data);
        setLogistics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching logistics');
        setLoading(false);
      }
    };

    fetchLogistics();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logistics</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Shipment ID</th>
            <th style={headerStyle}>Order ID</th>
            <th style={headerStyle}>Destination</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Estimated Delivery</th>
          </tr>
        </thead>
        <tbody>
          {logistics.map((logistics) => (
            <tr key={logistics._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{logistics.shipment_id}</td>
              <td style={cellStyle}>{logistics.order_id}</td>
              <td style={cellStyle}>{logistics.destination}</td>
              <td style={{ ...cellStyle, ...getStatusStyle(logistics.status) }}>
                {logistics.status}
              </td>
              <td style={cellStyle}>${logistics.estimated_delivery}</td>
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

export default Logistics;
