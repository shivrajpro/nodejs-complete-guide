const express = require('express');
const productsController = require('../controllers/products');

const router = express.Router();

router.get('/',productsController.getProducts);
router.get('/products',productsController.getAllProducts);
router.get('/cart',productsController.getCart);

module.exports = router;
