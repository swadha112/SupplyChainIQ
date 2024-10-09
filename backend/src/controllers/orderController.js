// const Order = require('../models/order');

// // Get all orders
// const getOrders = async (req, res, next) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (err) {
//     next(err); // Pass errors to error handler
//   }
// };

// module.exports = {
//   getOrders,
// };


const Order = require('../models/order');
const Logistics = require('../models/logistics');

// Get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Create a new order and link it with logistics
// Get the last shipment ID, increment, and create logistics
const createOrder = async (req, res, next) => {
  try {
    const { order_id, customer, date, total, destination } = req.body;

    // Create new order, default status is set to "Processing"
    const newOrder = await Order.create({
      order_id,
      customer,
      date, // date remains a string
      status: 'Processing', // Default status set here
      total: parseFloat(total), // Parse total to floating point
      destination
    });

    // Generate a new shipment ID based on the last shipment
    const lastShipment = await Logistics.findOne().sort({ shipment_id: -1 });
    const lastShipmentId = lastShipment ? parseInt(lastShipment.shipment_id.replace('SHIP', '')) : 0;
    const newShipmentId = `SHIP${String(lastShipmentId + 1).padStart(3, '0')}`;

    // Create a function to format the date as DD-MM-YYYY
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Calculate the estimated delivery date
    const estimatedDeliveryDate = new Date(new Date().setDate(new Date().getDate() + 7));
    
    // Format the estimated delivery date as DD-MM-YYYY
    const formattedEstimatedDelivery = formatDate(estimatedDeliveryDate);

    // Create corresponding logistics entry
    await Logistics.create({
      shipment_id: newShipmentId,
      order_id: order_id,
      destination: destination,
      status: 'Processing',
      estimated_delivery: formattedEstimatedDelivery, // Store as DD-MM-YYYY string
    });

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};



// Update the order status and synchronize with logistics status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { order_id, status } = req.body;

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate({ order_id }, { status }, { new: true });

    // Update logistics status for the corresponding order
    await Logistics.findOneAndUpdate({ shipment_id: order_id }, { status });

    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
