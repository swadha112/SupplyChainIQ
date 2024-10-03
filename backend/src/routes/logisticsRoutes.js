const express = require('express');
const { getLogistics } = require('../controllers/logisticsController');

const router = express.Router();

// Define the route to get all orders
router.get('/', getLogistics);

module.exports = router;
