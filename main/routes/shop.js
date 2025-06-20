import { Router } from 'express';
import * as shopController from '../controllers/shop.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetail);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);
// router.get('/checkout', shopController.getCheckout);

export default router;
