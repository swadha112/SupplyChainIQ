import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // List of products
  const products = [
    "cleanser", "toner", "sunscreen", "moisturizer", "face mask", "face cream", 
    "lip oils", "lip balms", "hair serum", "hair shampoo", "hair conditioner", 
    "hair oil", "body lotion", "body wash", "body exfoliator"
  ];

  const [newOrder, setNewOrder] = useState({
    product: products[0], // Default to the first product in the list
    quantity: 1,
    date: '',
    destination: '',
  });

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://vercel.com/api/toolbar/link/supply-chain-iq-backend-swadha112s-projects.vercel.app?via=project-dashboard-alias-list&p=1&page=/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      // Create new order (status defaults to "Processing")
      await axios.post('https://vercel.com/api/toolbar/link/supply-chain-iq-backend-swadha112s-projects.vercel.app?via=project-dashboard-alias-list&p=1&page=/api/orders', newOrder);
      // Re-fetch orders after adding a new one
      const updatedOrders = await axios.get('https://vercel.com/api/toolbar/link/supply-chain-iq-backend-swadha112s-projects.vercel.app?via=project-dashboard-alias-list&p=1&page=/api/orders');
      setOrders(updatedOrders.data);
      setSuccessMessage('Order added successfully!');
      setNewOrder({ product: products[0], quantity: 1, date: '', destination: '' });
    } catch (err) {
      setError('Error creating order');
      setSuccessMessage('');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      {/* Order Creation Form */}
      <form onSubmit={handleCreateOrder} style={formStyle}>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Product</label>
          <select
            name="product"
            value={newOrder.product}
            onChange={handleInputChange}
            style={inputStyle}
            required
          >
            {products.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newOrder.quantity}
            onChange={handleInputChange}
            style={inputStyle}
            required
            min="1"
          />
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={newOrder.date}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
        </div>

        <div style={inputContainerStyle}>
          <label style={labelStyle}>Destination</label>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={newOrder.destination}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
        </div>

        <button type="submit" style={buttonStyle}><b>Add Order</b></button>
      </form>

      {/* Order Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Order ID</th>
            <th style={headerStyle}>Product</th>
            <th style={headerStyle}>Quantity</th>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Destination</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{order.order_id}</td>
              <td style={cellStyle}>{order.product}</td>
              <td style={cellStyle}>{order.quantity}</td>
              <td style={cellStyle}>{order.date}</td>
              <td style={cellStyle}>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  order.status.toLowerCase() === 'delivered' ? 'bg-blue-100 text-blue-800' :
                  order.status.toLowerCase() === 'shipped' ? 'bg-orange-100 text-orange-800' :
                  order.status.toLowerCase() === 'processing' ? 'bg-purple-100 text-purple-800' :
                  order.status.toLowerCase() === 'in transit' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td style={cellStyle}>{order.destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles for table header and cells
const headerStyle = {
  borderBottom: '2px solid #000',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2'
};
const cellStyle = {
  padding: '10px',
  textAlign: 'left'
};

// Styles for the form
const formStyle = {
  display: 'flex',
  
  gap: '10px',
  marginBottom: '20px'
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width:'350px'
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold'
};

const inputStyle = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '14px',
  width: '50%'
};

const buttonStyle = {
  padding: '10px 15px',
  backgroundColor: '#89ff76',
  color: '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  width:'150px'
};

buttonStyle[':hover'] = {
  backgroundColor: 'green'
};

export default Orders;
