const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  in_stock: { type: Number, required: true },
  reorder_level: { type: Number, required: true },
});

module.exports = mongoose.model('Inventory', inventorySchema, 'Inventory'); // 'Inventory' is the collection name in MongoDB
