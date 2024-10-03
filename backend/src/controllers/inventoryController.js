const Inventory = require('../models/inventory');

// Get all orders
const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

module.exports = {
  getInventory,
};
