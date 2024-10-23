const express = require('express');
const { forecastInventory } = require('../controllers/inventoryController');  // Ensure this points to the forecast logic

const router = express.Router();

// Route to generate inventory forecast
router.post('/', forecastInventory);

module.exports = router;
