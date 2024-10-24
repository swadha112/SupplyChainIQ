// //require('dotenv').config();
// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const orderRoutes = require('./routes/orderRoutes');
// const errorHandler = require('./middleware/util/errorHandler');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB Atlas
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch((err) => console.error('Error connecting to MongoDB', err));

// // Use routes
// app.use('/api/orders', orderRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // // Error handling middleware
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supplierRoutes= require('./routes/supplierRoutes')
const inventoryRoutes = require ('./routes/inventoryRoutes')
const logisticsRoutes = require ('./routes/logisticsRoutes')
const errorHandler = require('./middleware/util/errorHandler');
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config(); 

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://supply-chain-iq.vercel.app', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api', emailRoutes);
// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Error handling middleware
app.use(errorHandler);

module.exports = app;
