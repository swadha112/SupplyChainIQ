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
    if (!newStatus) {
      alert('Please select a new status');
      return;
    }
    
    try {
      await axios.put(`http://localhost:5050/api/logistics/status`, { shipment_id, newStatus });
      // Re-fetch updated logistics data
      const updatedLogistics = await axios.get('http://localhost:5050/api/logistics');
      setLogistics(updatedLogistics.data);
      setNewStatus(''); // Reset status after saving
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>

      {/* Logistics Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Source</th>
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
              <td>{shipment.product_name}</td> {/* Added Product Name */}
              <td>{shipment.quantity}</td> {/* Added Quantity */}
              <td>{shipment.source}</td> {/* Added Source */}
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
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
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
