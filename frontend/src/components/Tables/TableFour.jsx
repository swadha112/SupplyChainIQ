// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Logistics = () => {
//   const [logistics, setLogistics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch orders from the backend API
//     const fetchLogistics = async () => {
//       try {
//         console.log('Attempting to fetch orders...');
//         const response = await axios.get('http://localhost:5050/api/logistics');
//         console.log('Orders fetched successfully:', response.data);
//         setLogistics(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching logistics');
//         setLoading(false);
//       }
//     };

//     fetchLogistics();
//   }, []);

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Logistics</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={headerStyle}>Shipment ID</th>
//             <th style={headerStyle}>Order ID</th>
//             <th style={headerStyle}>Destination</th>
//             <th style={headerStyle}>Status</th>
//             <th style={headerStyle}>Estimated Delivery</th>
//           </tr>
//         </thead>
//         <tbody>
//           {logistics.map((logistics) => (
//             <tr key={logistics._id} style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={cellStyle}>{logistics.shipment_id}</td>
//               <td style={cellStyle}>{logistics.order_id}</td>
//               <td style={cellStyle}>{logistics.destination}</td>
//               <td style={{ ...cellStyle, ...getStatusStyle(logistics.status) }}>
//                 {logistics.status}
//               </td>
//               <td style={cellStyle}>{logistics.estimated_delivery}</td>
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
//     case 'out for delivery':
//       return { color: 'green', fontWeight: 'bold' };
//     case 'shipped':
//       return { color: 'orange', fontWeight: 'bold' };
//     case 'processing':
//       return { color: 'red', fontWeight: 'bold' };
//     case 'in transit':
//       return {color: 'lightblue', fontWeight:'bold'}
//     default:
//       return {};
//   }
// };

// export default Logistics;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    // Fetch logistics data from the backend
    const fetchLogistics = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/logistics');
        setLogistics(response.data);
      } catch (err) {
        console.error('Error fetching logistics data', err);
      }
    };

    fetchLogistics();
  }, []);

  const handleStatusUpdate = async (shipment_id) => {
    try {
      await axios.put(`http://localhost:5050/api/logistics/status`, { shipment_id, newStatus });
      // Re-fetch updated logistics data
      const updatedLogistics = await axios.get('http://localhost:5050/api/logistics');
      setLogistics(updatedLogistics.data);
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logistics</h2>

      {/* Logistics Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Order ID</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Est. Delivery</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logistics.map((shipment) => (
            <tr key={shipment.shipment_id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{shipment.shipment_id}</td>
              <td>{shipment.order_id}</td>
              <td>{shipment.destination}</td>
              <td>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  shipment.status === 'In Transit' ? 'bg-green-100 text-green-800' :
                  shipment.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                  shipment.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {shipment.status}
                </span>
              </td>
              <td>{shipment.estimated_delivery}</td>
              <td>
                <div className="flex space-x-2">
                  <button onClick={() => alert(`Tracking Shipment: ${shipment.shipment_id}`)}>
                    Track Order
                  </button>
                  <select
                    onChange={(e) => setNewStatus(e.target.value)}
                    value={newStatus}
                    className="bg-white border rounded px-2"
                  >
                    <option value="">Update Status</option>
                    <option value="processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    
                  </select>
                  <button onClick={() => handleStatusUpdate(shipment.shipment_id)}>Save</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logistics;
