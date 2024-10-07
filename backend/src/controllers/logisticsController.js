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

// Get all logistics
exports.getAllLogistics = async (req, res) => {
  try {
    const logistics = await Logistics.find();
    res.json(logistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get logistics by tracking ID
exports.getLogisticsByTrackingId = async (req, res) => {
  try {
    const logistics = await Logistics.findOne({ trackingId: req.params.trackingId });
    if (logistics == null) {
      return res.status(404).json({ message: 'Logistics entry not found' });
    }
    res.json(logistics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new logistics entry and link it to an order
exports.createLogistics = async (req, res) => {
  const { trackingId, origin, destination, status, estimatedDelivery, currentLocation, orderId } = req.body;

  const logistics = new Logistics({
    trackingId,
    origin,
    destination,
    status,
    estimatedDelivery,
    currentLocation,
  });

  try {
    const newLogistics = await logistics.save();

    // Update the linked order's status to "Processing" when logistics is created
    await Order.findOneAndUpdate({ order_id: orderId }, { status: 'Processing' });

    res.status(201).json(newLogistics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update logistics status and synchronize with the linked order
exports.updateLogisticsStatus = async (req, res) => {
  try {
    const logistics = await Logistics.findOne({ trackingId: req.params.trackingId });
    if (logistics == null) {
      return res.status(404).json({ message: 'Logistics entry not found' });
    }

    if (req.body.status != null) {
      logistics.status = req.body.status;

      // Update the linked order's status to match the logistics' status
      await Order.findOneAndUpdate({ order_id: logistics.trackingId }, { status: req.body.status });
    }

    const updatedLogistics = await logistics.save();
    res.json(updatedLogistics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get logistics status statistics
exports.getLogisticsStatusStats = async (req, res) => {
  try {
    const stats = await Logistics.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
