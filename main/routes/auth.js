import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { check } from 'express-validator';

const router = Router();
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup',
    check('email')
        .isEmail().withMessage('Please enter a valid email.')
        .custom(value => {
            if(value === 'test@test.com') {
                throw new Error('This email address is forbidden')
            }
            return true;
        }),
    authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

export default router;
