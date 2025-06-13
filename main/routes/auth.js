import { Router } from 'express';
import * as authController from '../controllers/auth.js';

const router = Router();
router.get('/login', authController.getLogin);

export default router;
