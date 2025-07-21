import { Router } from 'express';
import { postLogin, putSignup } from '../controllers/auth';
import { body } from 'express-validator';
import { User } from '../models/user';

const router = Router();

router.put('/signup', [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then(userDoc => {
          if(userDoc) {
            return Promise.reject('E-Mail address already exists');
          }
        })
    })
    .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().notEmpty()
], putSignup);

router.post('/login', postLogin);

export default router;
