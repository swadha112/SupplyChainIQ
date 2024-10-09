const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  date: { type: String, required: true }, // Changed date to String
  status: { type: String, required: true },
  total: { type: mongoose.Types.Decimal128, required: true }, // Changed total to Decimal128 (double)
  destination: { type: String, required: true }, // Added destination field
});

module.exports = mongoose.model('Order', orderSchema, 'Orders');
