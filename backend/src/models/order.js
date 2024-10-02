const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  customer: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  total: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema, 'Orders'); // 'orders' is the collection name in MongoDB
