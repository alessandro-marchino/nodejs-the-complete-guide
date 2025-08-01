import { Router } from "express";
import { isAuth } from "../middleware/auth";
import { createPost, deletePost, getPost, getPosts, updatePost } from "../controllers/feed";
import { body } from "express-validator";

const router = Router();

// GET /feed/posts
router.get('/posts', isAuth, getPosts);

// POST /feed/post
router.post('/post', isAuth, [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
  ], createPost);

router.get('/post/:postId', isAuth, getPost);

router.put('/post/:postId', isAuth, [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
  ], updatePost);

router.delete('/post/:postId', isAuth, deletePost);

export default router;
