// const express = require('express');
// const { getLogistics } = require('../controllers/logisticsController');

// const router = express.Router();

// // Define the route to get all orders
// router.get('/', getLogistics);

// module.exports = router;

const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');

// Get all logistics
router.get('/', logisticsController.getAllLogistics);

// Get logistics by tracking ID
router.get('/:trackingId', logisticsController.getLogisticsByTrackingId);

// Create a new logistics entry
router.post('/', logisticsController.createLogistics);

// Update logistics status
router.patch('/:trackingId', logisticsController.updateLogisticsStatus);

// Get logistics status statistics
router.get('/stats/logisticsStatus', logisticsController.getLogisticsStatusStats);

module.exports = router;
