// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch orders from the backend API
//     const fetchOrders = async () => {
//       try {
//         console.log('Attempting to fetch orders...');
//         const response = await axios.get('http://localhost:5050/api/orders');
//         console.log('Orders fetched successfully:', response.data);
//         setOrders(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching orders');
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ padding: '20px' }}>
      
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={headerStyle} >Order ID</th>
//             <th style={headerStyle}>Customer</th>
//             <th style={headerStyle}>Date</th>
//             <th style={headerStyle}>Status</th>
//             <th style={headerStyle}>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={cellStyle}>{order.order_id}</td>
//               <td style={cellStyle}>{order.customer}</td>
//               <td style={cellStyle}>{order.date}</td>
//               <td style={{ ...cellStyle, ...getStatusStyle(order.status) }}>
//                 {order.status}
//               </td>
//               <td style={cellStyle}>${order.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Styles for table header
// const headerStyle = {
//   borderBottom: '2px solid #000',
//   padding: '10px',
//   textAlign: 'left',
//   backgroundColor: '#f2f2f2'
// };

// // Styles for table cells
// const cellStyle = {
//   padding: '10px',
//   textAlign: 'left',
// };

// // Function to return style based on the status
// const getStatusStyle = (status) => {
//   switch (status.toLowerCase()) {
//     case 'delivered':
//       return { color: 'green', fontWeight: 'bold' };
//     case 'shipped':
//       return { color: 'orange', fontWeight: 'bold' };
//     case 'processing':
//       return { color: 'red', fontWeight: 'bold' };
//     default:
//       return {};
//   }
// };

// export default Orders;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState({
    order_id: '',
    customer: '',
    date: '',
    status: '',
    total: '',
    destination: '', // New field for logistics destination
  });

  useEffect(() => {
    // Fetch orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/orders');
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
      // Create new order
      await axios.post('http://localhost:5050/api/orders', newOrder);
      const { order_id, destination } = newOrder;

      // Create linked logistics entry
      await axios.post('http://localhost:5050/api/logistics', {
        trackingId: order_id,
        origin: 'Warehouse', // Assuming a fixed origin for simplicity
        destination,
        status: 'Processing',
        estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 7)), // Example estimated delivery date
        currentLocation: { lat: 0, lng: 0 }, // Example starting coordinates, modify as needed
      });

      // Re-fetch orders after adding a new one
      const updatedOrders = await axios.get('http://localhost:5050/api/orders');
      setOrders(updatedOrders.data);
      setNewOrder({ order_id: '', customer: '', date: '', status: '', total: '', destination: '' });
    } catch (err) {
      setError('Error creating order');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>
      
      {/* Order Creation Form */}
      <form onSubmit={handleCreateOrder}>
        <input
          type="text"
          name="order_id"
          placeholder="Order ID"
          value={newOrder.order_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="customer"
          placeholder="Customer"
          value={newOrder.customer}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newOrder.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="total"
          placeholder="Total"
          value={newOrder.total}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={newOrder.destination}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Order</button>
      </form>

      {/* Order Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Order ID</th>
            <th style={headerStyle}>Customer</th>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{order.order_id}</td>
              <td style={cellStyle}>{order.customer}</td>
              <td style={cellStyle}>{new Date(order.date).toLocaleDateString()}</td>
              <td style={{ ...cellStyle, ...getStatusStyle(order.status) }}>{order.status}</td>
              <td style={cellStyle}>${order.total}</td>
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
const getStatusStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered': return { color: 'green', fontWeight: 'bold' };
    case 'shipped': return { color: 'orange', fontWeight: 'bold' };
    case 'processing': return { color: 'red', fontWeight: 'bold' };
    case 'in transit': return { color: 'blue', fontWeight: 'bold' };
    default: return {};
  }
};

export default Orders;
