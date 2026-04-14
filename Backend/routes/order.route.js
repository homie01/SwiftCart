const express = require('express');
const orderController = require("../controller/orderController");
const router = express.Router();

router.get('/:userId', orderController.getUsersOrders);
router.post('/:userId', orderController.placeOrder);
router.put('/:userId/:orderId', orderController.confirmOrder);

module.exports = router;
