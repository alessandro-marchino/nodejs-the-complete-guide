import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

router.use(isAuth);

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);
router.get('/products', adminController.getProducts);

export default router;
