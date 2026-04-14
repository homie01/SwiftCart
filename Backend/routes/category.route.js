const express = require('express');
const categoryController = require('../controller/categoryController');

const router = express.Router();

router.get('/', categoryController.all);
router.post('/', categoryController.add);

module.exports = router;
