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
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLogistics, setSelectedLogistics] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your Google Maps API Key

  useEffect(() => {
    // Fetch logistics from the backend API
    const fetchLogistics = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/logistics');
        setLogistics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching logistics');
        setLoading(false);
      }
    };

    fetchLogistics();
  }, []);

  const handleStatusChange = async (trackingId) => {
    try {
      await axios.patch(`http://localhost:5050/api/logistics/${trackingId}`, { status: newStatus });
      // Update logistics state after successful update
      const updatedLogistics = await axios.get('http://localhost:5050/api/logistics');
      setLogistics(updatedLogistics.data);
      setNewStatus('');
      setSelectedLogistics(null);
    } catch (err) {
      setError('Error updating status');
    }
  };

  if (loading) return <p>Loading logistics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logistics</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerStyle}>Tracking ID</th>
            <th style={headerStyle}>Origin</th>
            <th style={headerStyle}>Destination</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Estimated Delivery</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logistics.map((logistic) => (
            <tr key={logistic._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={cellStyle}>{logistic.trackingId}</td>
              <td style={cellStyle}>{logistic.origin}</td>
              <td style={cellStyle}>{logistic.destination}</td>
              <td style={{ ...cellStyle, ...getStatusStyle(logistic.status) }}>
                {logistic.status}
              </td>
              <td style={cellStyle}>{new Date(logistic.estimatedDelivery).toLocaleDateString()}</td>
              <td style={cellStyle}>
                <button onClick={() => setSelectedLogistics(logistic)}>Track Order</button>
                <button onClick={() => setSelectedLogistics(logistic)}>Update Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLogistics && (
        <div style={{ marginTop: '20px' }}>
          <h3>Track Order: {selectedLogistics.trackingId}</h3>
          {/* Google Maps Component */}
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%' }}
              center={{ lat: selectedLogistics.currentLocation.lat, lng: selectedLogistics.currentLocation.lng }}
              zoom={10}
            >
              <Marker
                position={{ lat: selectedLogistics.currentLocation.lat, lng: selectedLogistics.currentLocation.lng }}
              />
            </GoogleMap>
          </LoadScript>

          {/* Update Status Form */}
          <div style={{ marginTop: '20px' }}>
            <h3>Update Shipment Status for: {selectedLogistics.trackingId}</h3>
            <input
              type="text"
              placeholder="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            />
            <button onClick={() => handleStatusChange(selectedLogistics.trackingId)}>Update Status</button>
          </div>
        </div>
      )}
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
    case 'in transit': return { color: 'blue', fontWeight: 'bold' };
    case 'processing': return { color: 'red', fontWeight: 'bold' };
    case 'delayed': return { color: 'orange', fontWeight: 'bold' };
    default: return {};
  }
};

export default Logistics;
