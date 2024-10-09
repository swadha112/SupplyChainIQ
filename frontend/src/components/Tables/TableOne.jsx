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

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>

      {/* Order Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Order ID</th>
            <th style={headerStyle}>Customer</th>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Total</th>
            <th style={headerStyle}>Destination</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{order.order_id}</td>
              <td style={cellStyle}>{order.customer}</td>
              <td style={cellStyle}>{order.date}</td>
              <td style={cellStyle}>
                {/* Highlight status */}
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  order.status.toLowerCase() === 'delivered' ? 'bg-blue-100 text-blue-800' :
                  order.status.toLowerCase() === 'shipped' ? 'bg-orange-100 text-orange-800' :
                  order.status.toLowerCase() === 'processing' ? 'bg-purple-100 text-purple-800' :
                  order.status.toLowerCase() === 'in transit' ? 'bg-green-100 text-green-800' :
                  order.status.toLowerCase() === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td style={cellStyle}>${parseFloat(order.total.$numberDecimal).toFixed(2)}</td>
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
  backgroundColor: '#f2f2f2',
};
const cellStyle = {
  padding: '10px',
  textAlign: 'left',
};

export default Orders;
