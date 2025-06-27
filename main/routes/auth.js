import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { body, check } from 'express-validator';
import User from '../model/user.js';

const router = Router();
router.get('/login', authController.getLogin);
router.post('/login', [
    body('email')
        .isEmail().withMessage('Please enter a valid email.')
        .custom(value => User.findOne({ email: value })
            .then(userDoc => {
                if(!userDoc) {
                    throw new Error('Invalid email or password.');
                }
            })
        ),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters long.')
        .isLength({ min: 5 })
        .isAlphanumeric(),
], authController.postLogin);
router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email')
        .isEmail().withMessage('Please enter a valid email.')
        .custom(value => User.findOne({ email: value })
            .then(userDoc => {
                if(userDoc) {
                    throw new Error('Email exists already. Please pick a different one.');
                }
            })
        ),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters long.')
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match.');
            }
            return true;
        })
    ], authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

export default router;
