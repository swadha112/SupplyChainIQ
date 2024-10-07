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

const LogisticsSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true, enum: ['Processing', 'In Transit', 'Delivered', 'Delayed'] },
  estimatedDelivery: { type: Date, required: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Logistics', LogisticsSchema, 'Logistics');
