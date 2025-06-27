import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { body, check } from 'express-validator';

const router = Router();
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email')
        .isEmail().withMessage('Please enter a valid email.')
        .custom(value => {
            if(value === 'test@test.com') {
                throw new Error('This email address is forbidden')
            }
            return true;
        }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters long.')
        .isLength({ min: 5 })
        .isAlphanumeric()
    ], authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

export default router;
