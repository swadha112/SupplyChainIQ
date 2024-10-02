const express = require('express');
const { getOrders } = require('../controllers/orderController');

const router = express.Router();

// Define the route to get all orders
router.get('/', getOrders);

module.exports = router;
