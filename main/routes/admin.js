import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import isAuth from '../middleware/is-auth.js';
import { body } from 'express-validator';

const router = Router();

router.use(isAuth);

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
], adminController.postAddProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', [
    body('title')
        .isAlphanumeric()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
], adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);
router.get('/products', adminController.getProducts);

export default router;
