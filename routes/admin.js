const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);


// admin/products => GET
router.get('/products', adminController.getProducts);

// admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

// admin/edit-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct);

// admin/products/prodId => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;