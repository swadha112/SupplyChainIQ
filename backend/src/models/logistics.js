const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  shipment_id: { type: String, required: true, unique: true },
  order_id: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  estimated_delivery: { type: String, required: true }, // Storing as String, consider changing to Date for date operations
});

module.exports = mongoose.model('Logistics', logisticsSchema, 'Logistics'); // 'Logistics' is the collection name in MongoDB
