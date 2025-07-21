import { Router } from 'express';
import { getStatus, patchStatus, postLogin, putSignup } from '../controllers/auth';
import { body } from 'express-validator';
import { User } from '../models/user';
import { isAuth } from '../middleware/isAuth';

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

router.get('/status', isAuth, getStatus);
router.patch('/status', isAuth, patchStatus);

export default router;
