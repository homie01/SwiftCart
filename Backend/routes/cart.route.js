const express = require('express');
const cartController = require('../controller/cartController');

const router = express.Router();

router.post('/:id', cartController.addProductToCart);
router.delete('/:id/:userId', cartController.removeFromCart);
router.get('/:id', cartController.getUsersCart);

module.exports = router;
