import { Router } from 'express';
import * as shopController from '../controllers/shop.js';
import isAuth from '../middleware/is-auth.js';
import { query } from 'express-validator';

const router = Router();

router.get('/', [
  query('page', 'The page is incorrectly formatted')
    .optional()
    .isInt({ min: 1 })
], shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProductDetail);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
// router.get('/checkout', shopController.getCheckout);

export default router;
