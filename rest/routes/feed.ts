import { Router } from 'express';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/feed.js';
import { body } from 'express-validator';
import { isAuth } from '../middleware/isAuth.js';

const router = Router();

router.get('/posts', isAuth, getPosts);
router.post('/posts', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], createPost);

router.get('/posts/:postId', getPost);
router.put('/posts/:postId', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], updatePost);
router.delete('/posts/:postId', deletePost);

export default router;
