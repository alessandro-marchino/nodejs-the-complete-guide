import { Router } from 'express';
import * as shopController from '../controllers/shop.js';

const router = Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetail);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);
// router.get('/checkout', shopController.getCheckout);

export default router;
