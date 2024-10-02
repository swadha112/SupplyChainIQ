const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'SupplyChainIQ';
const collectionName = 'Orders';  // Orders collection inside DummyData

// Route to get all orders
router.get('/', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('DummyData');  // Access DummyData database
    const ordersCollection = db.collection(collectionName);  // Access Orders collection

    let orders = await ordersCollection.find().toArray();  // Fetch all orders

    // Convert Decimal128 values to numbers
    orders = orders.map(order => {
      return {
        ...order,
        total: order.total && order.total.toString() // Convert Decimal128 to string or number
      };
    });

    res.status(200).json(orders);  // Send orders to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  } finally {
    await client.close();
  }
});

module.exports = router;
