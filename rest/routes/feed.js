import { Router } from 'express';
import { createPost, getPosts } from '../controllers/feed.js';
import { body } from 'express-validator';

const router = Router();

router.get('/posts', getPosts);
router.post('/posts', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], createPost);

export default router;
