import { Router } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { getUserStatus, login, signup, updateUserStatus } from "../controllers/auth";
import { isAuth } from "../middleware/auth";

const router = Router();

router.put('/signup', [
  body('email')
    .isEmail().withMessage('Please enter a valid email.')
    .custom(async (value, { req }) => {
      const userDoc = await User.findOne({ email: value });
      if(userDoc) {
        throw new Error('E-Mail address already exists!');
      }
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 5 }),
  body('name')
    .trim()
    .not().isEmpty()
  ], signup);

router.post('/login', login);

router.get('/status', isAuth, getUserStatus);

router.patch('/status', isAuth, [
  body('status')
    .trim()
    .not().isEmpty()
  ], updateUserStatus);

export default router;
