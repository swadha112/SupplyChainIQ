const Order = require('../models/order');

// Get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

module.exports = {
  getOrders,
};
