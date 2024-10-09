// const Logistics = require('../models/logistics');

// // Get all orders
// const getLogistics = async (req, res, next) => {
//   try {
//     const logistics = await Logistics.find();
//     res.json(logistics);
//   } catch (err) {
//     next(err); // Pass errors to error handler
//   }
// };

// module.exports = {
//   getLogistics,
// };


const Logistics = require('../models/logistics');
const Order = require('../models/order');

// Fetch all logistics data
const getLogistics = async (req, res, next) => {
  try {
    const logistics = await Logistics.find();
    res.json(logistics);
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
};

// Update shipment status and synchronize with the order status
const updateShipmentStatus = async (req, res, next) => {
  try {
    const { shipment_id, newStatus } = req.body;

    // Find the logistics entry by shipment_id and update the status
    const updatedShipment = await Logistics.findOneAndUpdate(
      { shipment_id },
      { status: newStatus },
      { new: true }
    );

    if (updatedShipment) {
      // Also update the status in the Orders table using order_id
      await Order.findOneAndUpdate(
        { order_id: updatedShipment.order_id },
        { status: newStatus }
      );
    }

    res.json(updatedShipment);
  } catch (err) {
    next(err); // Pass errors to the error handler
  }
};

module.exports = {
  getLogistics,
  updateShipmentStatus,
};
