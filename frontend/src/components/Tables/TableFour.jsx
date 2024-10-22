import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet'; // Import Leaflet for map functionality
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const Logistics = () => {
  const [logistics, setLogistics] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);
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

  const handleTrackOrder = (shipment) => {
    if (shipment.sourceLat && shipment.sourceLng && shipment.destinationLat && shipment.destinationLng) {
      setSelectedShipment(shipment);

      if (map) {
        map.remove(); // Remove the previous map before creating a new one
      }

      // Create a new map centered at the source location
      const newMap = L.map('map').setView([shipment.sourceLat, shipment.sourceLng], 6);

      // Set up the OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(newMap);

      // Add markers for source and destination
      const sourceMarker = L.marker([shipment.sourceLat, shipment.sourceLng]).addTo(newMap);
      const destinationMarker = L.marker([shipment.destinationLat, shipment.destinationLng]).addTo(newMap);

      // Add popup information to markers
      sourceMarker.bindPopup('Source Location').openPopup();
      destinationMarker.bindPopup('Destination Location');

      // Draw a route between source and destination
      const route = L.polyline([[shipment.sourceLat, shipment.sourceLng], [shipment.destinationLat, shipment.destinationLng]], { color: 'blue' }).addTo(newMap);

      // Fit the map bounds to show the full route
      newMap.fitBounds(route.getBounds());

      // Save the map instance to the state
      setMap(newMap);
    } else {
      alert("Latitude and Longitude are missing for this shipment.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Logistics</h2>

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
              <td>{shipment.destination}</td> {/* Added Destination */}
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
                  {/* Track Order Button */}
                  <button onClick={() => handleTrackOrder(shipment)}>
                    Track Order
                  </button>
                  {/* Status Update Dropdown */}
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

      {/* Map Container */}
      {selectedShipment && (
        <div id="map" style={{ height: '400px', marginTop: '20px' }}></div>
      )}
    </div>
  );
};

export default Logistics;
