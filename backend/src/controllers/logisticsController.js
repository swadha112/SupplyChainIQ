const Logistics = require('../models/logistics');

// Get all orders
const getLogistics = async (req, res, next) => {
  try {
    const logistics = await Logistics.find();
    res.json(logistics);
  } catch (err) {
    next(err); // Pass errors to error handler
  }
};

module.exports = {
  getLogistics,
};
