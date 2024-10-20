const Order = require('../models/order');
const Logistics = require('../models/logistics');
const { getNearestSource } = require('../services/geoService'); // Import the service for geocoding and distance

// Plant sources with lat/lng coordinates
const plantSources = [
  { name: 'Plant A', location: { lat: 40.7128, lng: -74.0060 } }, // New York
  { name: 'Plant B', location: { lat: 34.0522, lng: -118.2437 } }, // Los Angeles
  { name: 'Plant C', location: { lat: 41.8781, lng: -87.6298 } },  // Chicago
  { name: 'Plant D', location: { lat: 29.7604, lng: -95.3698 } },  // Houston
  { name: 'Plant E', location: { lat: 33.4484, lng: -112.0740 } }  // Phoenix
];

// Function to generate the next sequential order ID
async function getNextOrderId() {
  const lastOrder = await Order.findOne().sort({ order_id: -1 });
  if (!lastOrder) {
    return 'ORD001'; // Start with ORD001 if no orders exist
  }
  const lastOrderId = lastOrder.order_id;
  const orderNumber = parseInt(lastOrderId.replace('ORD', ''), 10);
  const newOrderNumber = orderNumber + 1;
  return `ORD${newOrderNumber.toString().padStart(3, '0')}`;
}

// Function to generate the next sequential shipment ID
async function getNextShipmentId() {
  const lastShipment = await Logistics.findOne().sort({ shipment_id: -1 });
  const lastShipmentId = lastShipment ? parseInt(lastShipment.shipment_id.replace('SHIP', '')) : 0;
  const newShipmentId = `SHIP${String(lastShipmentId + 1).padStart(3, '0')}`;
  return newShipmentId;
}

// Helper function to format the date as DD-MM-YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Create a new order and link it with logistics
const createOrder = async (req, res, next) => {
  try {
    const { customer, date, product, quantity, destination } = req.body;

    // Generate the next sequential order ID
    const newOrderId = await getNextOrderId();

    // Calculate nearest source based on destination name
    const nearestSource = await getNearestSource(destination, plantSources); // Now passing destination name

    // Create new order with default status "Processing"
    const newOrder = await Order.create({
      order_id: newOrderId,
      product,
      date,
      status: 'Processing', // Default status set here
      quantity: parseInt(quantity),
      destination
    });

    // Generate a new shipment ID
    const newShipmentId = await getNextShipmentId();

    // Calculate estimated delivery date (e.g., 7 days from now)
    const estimatedDeliveryDate = new Date(new Date().setDate(new Date().getDate() + 7));
    const formattedEstimatedDelivery = formatDate(estimatedDeliveryDate);

    // Create corresponding logistics entry
    await Logistics.create({
      shipment_id: newShipmentId,
      order_id: newOrderId,
      product,
      quantity,
      source: nearestSource.name, // Assign the nearest source
      destination,
      status: 'Processing',
      estimated_delivery: formattedEstimatedDelivery,
    });

    res.status(201).json({ message: 'Order and Logistics created successfully with optimized source!', order: newOrder });
  } catch (err) {
    next(err);
  }
};

// Get all orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
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
    await Logistics.findOneAndUpdate({ order_id }, { status });

    res.json({ message: 'Order and Logistics status updated!', order: updatedOrder });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
};
