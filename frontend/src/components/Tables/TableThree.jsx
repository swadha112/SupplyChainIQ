import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [activePlant, setActivePlant] = useState(null); // Track active plant
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/inventory');
        setInventory(response.data);
        setActivePlant(response.data[0]?.plant_name || null); // Set the first plant as default active
        setLoading(false);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

  const handleReorderClick = (productName, plantName) => {
    navigate('/profile', { state: { productName, plantName } });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Tabs (buttons) for each plant */}
      <div style={{ marginBottom: '20px' }}>
        {Array.isArray(inventory) && inventory.length > 0 ? (
          inventory.map((plant) => (
            <button
              key={plant.plant_name}
              onClick={() => setActivePlant(plant.plant_name)}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                cursor: 'pointer',
                backgroundColor: activePlant === plant.plant_name ? '#89ff76' : '#f2f2f2',
                color: activePlant === plant.plant_name ? '#000' : '#000',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontWeight: 'bold',
              }}
            >
              {plant.plant_name}
            </button>
          ))
        ) : (
          <p>No plants available</p>
        )}
      </div>

      {/* Display the inventory for the selected plant */}
      {inventory.map((plant) =>
        plant.plant_name === activePlant ? (
          <div key={plant._id} style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'left' }}>{plant.plant_name} Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={headerStyle}>Product Name</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>In Stock</th>
                  <th style={headerStyle}>Reorder Level</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(plant.products) &&
                  plant.products.map((product, i) => (
                    <tr key={`${product.product_name}-${i}`} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={cellStyle}>{product.product_name}</td>
                      <td style={cellStyle}>{product.category}</td>
                      <td style={cellStyle}>
                        <span
                          style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            color: 'white',
                            backgroundColor: product.stock <= product.reorder_level ? '#e74c3c' : '#2ecc71',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td style={cellStyle}>{product.reorder_level}</td>
                      <td style={cellStyle}>
                        {product.stock <= product.reorder_level && (
                          <button
                            onClick={() => handleReorderClick(product.product_name, plant.plant_name)}
                            style={buttonStyle}
                          >
                            Reorder
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : null
      )}
    </div>
  );
};

// CSS Styles for the table
const headerStyle = {
  padding: '12px',
  textAlign: 'left',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd',
};

const cellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#89ff76',
  color: '#000',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Inventory;
