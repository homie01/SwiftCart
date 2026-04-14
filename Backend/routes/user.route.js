const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/', userController.all);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.put('/addresses/:userId', userController.updateAddress);
router.delete('/addresses/:userId/:addressId', userController.deleteAddress);
router.put('/password/:userId', userController.updatePassword);

module.exports = router;
