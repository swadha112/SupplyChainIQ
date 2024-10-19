// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Suppliers = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch suppliers from the backend API
//     const fetchSuppliers = async () => {
//       try {
//         console.log('Attempting to fetch suppliers...');
//         const response = await axios.get('http://localhost:5050/api/suppliers');
//         console.log('Suppliers fetched successfully:', response.data);
//         setSuppliers(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching suppliers');
//         setLoading(false);
//       }
//     };

//     fetchSuppliers();
//   }, []);

//   if (loading) return <p>Loading suppliers...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Suppliers</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={headerStyle}>Supplier ID</th>
//             <th style={headerStyle}>Name</th>
//             <th style={headerStyle}>Category</th>
//             <th style={headerStyle}>Performance</th>
//             <th style={headerStyle}>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {suppliers.map((supplier) => (
//             <tr key={supplier._id} style={{ borderBottom: '1px solid #ddd' }}>
//               <td style={cellStyle}>{supplier.supplier_id}</td>
//               <td style={cellStyle}>{supplier.name}</td>
//               <td style={cellStyle}>{supplier.category}</td>
//               <td style={{ ...cellStyle, ...getPerformanceStyle(supplier.performance) }}>
//                 {supplier.performance}
//               </td>
//               <td style={cellStyle}>{new Date(supplier.last_order_date).toLocaleDateString()}</td>
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
//   backgroundColor: '#f2f2f2',
// };

// // Styles for table cells
// const cellStyle = {
//   padding: '10px',
//   textAlign: 'left',
// };

// // Function to return style based on the performance value
// const getPerformanceStyle = (performance) => {
//   if (performance > 90) {
//     return { color: 'green', fontWeight: 'bold' };
//   } else if (performance >= 80 && performance <= 90) {
//     return { color: 'orange', fontWeight: 'bold' };
//   } else if (performance < 80) {
//     return { color: 'red', fontWeight: 'bold' };
//   }
//   return {};
// };

// export default Suppliers;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [shipmentPort, setShipmentPort] = useState('');

  const location = useLocation();
  const { productName } = location.state || {};  // Get productName from Inventory page

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/suppliers');
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching suppliers');
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/send-email', {
        supplierEmail: selectedSupplier.email,
        productName,
        quantity,
        shipmentPort,
      });
      alert(`Email sent to ${selectedSupplier.name} for product ${productName}`);
      setQuantity('');
      setShipmentPort('');
      setShowForm(false);
    } catch (err) {
      setError('Error sending email');
    }
  };

  if (loading) return <p>Loading suppliers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Suppliers</h2>

      {productName && (
        <div className="popup-message">
          <p>Choose your supplier to reorder {productName}</p>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Performance</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{supplier.supplier_id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.category}</td>
              <td>{supplier.performance}</td>
              <td>{supplier.email}</td>
              <td>
                <button onClick={() => { setSelectedSupplier(supplier); setShowForm(true); }}>
                  Send Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <form onSubmit={handleSendEmail} style={{ marginTop: '20px' }}>
          <h3>Send Email to {selectedSupplier.name}</h3>
          <div>
            <label>Product Name: </label>
            <input type="text" value={productName} disabled />
          </div>
          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Shipment Port: </label>
            <input
              type="text"
              value={shipmentPort}
              onChange={(e) => setShipmentPort(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Email</button>
        </form>
      )}
    </div>
  );
};

export default Suppliers;
