// const Order = require('../models/order');

// // Get all orders
// const getOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (err) {
//     next(err); // Pass errors to error handler
//   }
// };

// module.exports = {
//   getOrders,
// };


const Order = require('../models/order');
const Logistics = require('../models/logistics');

// Get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Create a new order and link it with logistics
const createOrder = async (req, res, next) => {
  try {
    const { order_id, customer, date, status, total, destination } = req.body;

    // Create new order
    const newOrder = await Order.create({ order_id, customer, date, status, total });

    // Create corresponding logistics entry
    await Logistics.create({
      trackingId: order_id,
      origin: 'Warehouse', // You can modify this as needed
      destination,
      status: 'Processing',
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 7)), // Example estimated delivery date
      currentLocation: { lat: 0, lng: 0 }, // Default starting coordinates
    });

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};

// Update the order status and synchronize with logistics status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_id, status } = req.body;

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate({ order_id }, { status }, { new: true });

    // Update logistics status for the corresponding order
    await Logistics.findOneAndUpdate({ trackingId: order_id }, { status });

    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
