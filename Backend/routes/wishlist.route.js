const express = require('express');
const wishListController = require('../controller/wishListController');

const router = express.Router();

router.get('/', wishListController.all);
router.get('/:id', wishListController.getUsersWishlist);
router.post('/:userId', wishListController.add);
router.delete('/:id/:userId', wishListController.remove);

module.exports = router;
