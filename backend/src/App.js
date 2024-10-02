const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Import the orders route
const ordersRoute = require('./routes/orders');

// Middleware
app.use(cors()); // Allow CORS for all origins
app.use(express.json());

// Use the orders route for any `/api/orders` requests
app.use('/api/orders', ordersRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
