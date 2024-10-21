import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/inventory');
        
        setInventory(response.data);
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


      {/* Loop through each plant in the inventory */}
      {Array.isArray(inventory) && inventory.length > 0 ? (
        inventory.map((plant) => (
          <div key={plant._id} style={{ marginBottom: '30px' }}>
            <h3>{plant.plant_name}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Reorder Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(plant.products) && plant.products.map((product, i) => (
                  <tr key={`${product.product_name}-${i}`} style={{ borderBottom: '1px solid #ddd' }}>
                    <td>{product.product_name}</td>
                    <td>{product.category}</td>
                    <td style={{ color: product.stock <= product.reorder_level ? 'red' : 'green', fontWeight: 'bold' }}>
                      {product.stock}
                    </td>
                    <td>{product.reorder_level}</td>
                    <td>
                      {product.stock <= product.reorder_level && (
                        <button onClick={() => handleReorderClick(product.product_name, plant.plant_name)}>
                          Reorder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No inventory available</p>
      )}
    </div>
  );
};

export default Inventory;
