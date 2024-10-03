const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplier_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  performance: { type: Number, required: true },
  last_order_date: { type: Date, required: true },
});

module.exports = mongoose.model('Supplier', supplierSchema, 'Suppliers'); // 'Suppliers' is the collection name in MongoDB
