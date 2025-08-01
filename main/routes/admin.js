import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import isAuth from '../middleware/is-auth.js';
import { body, check } from 'express-validator';

const router = Router();

router.use(isAuth);

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  check('file')
    .optional()
    .custom((value, meta) => {
      if(!meta.req.file) {
        throw new Error('Attached file is not an image.');
      }
    }),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 5, max: 400 })
    .trim()
], adminController.postAddProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', [
  body('title')
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body('price')
    .isFloat(),
  body('description')
    .isLength({ min: 5, max: 400 })
    .trim()
], adminController.postEditProduct);
router.get('/products', adminController.getProducts);

router.delete('/products/:productId', adminController.deleteProduct);

export default router;
