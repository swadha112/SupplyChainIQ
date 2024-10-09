// const mongoose = require('mongoose');

// const logisticsSchema = new mongoose.Schema({
//   shipment_id: { type: String, required: true, unique: true },
//   order_id: { type: String, required: true },
//   destination: { type: String, required: true },
//   status: { type: String, required: true },
//   estimated_delivery: { type: String, required: true }, // Storing as String, consider changing to Date for date operations
// });

// module.exports = mongoose.model('Logistics', logisticsSchema, 'Logistics'); // 'Logistics' is the collection name in MongoDB


const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  shipment_id: { type: String, required: true, unique: true },
  order_id: { type: String, required: true }, // Link to the order ID
  estimated_delivery: { type: String, required: true }, // Storing as a string for simplicity
  destination: { type: String, required: true }, // Destination as per order
  status: { type: String, required: true }, // Status as per order
});

module.exports = mongoose.model('Logistics', logisticsSchema, 'Logistics'); // Collection name: Logistics

