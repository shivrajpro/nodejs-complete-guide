const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/',shopController.getIndex);
router.get('/products',shopController.getProducts);
router.get('/products/:productId',shopController.getProductById);
router.get('/cart', isAuth,shopController.getCart);
router.post('/cart', isAuth,shopController.postCart);
router.post('/delete-cart-item', isAuth, shopController.postDeleteCartItem);
router.get('/orders', isAuth,shopController.getOrders);
// router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
router.get('/checkout', shopController.getCheckout);
// router.get('/checkout/success', shopController.postOrder);
router.get('/checkout/success', shopController.postOrder);
router.get('/checkout/cancel', shopController.getCheckout);


module.exports = router;
