import { Router } from 'express';
import { getPosts } from '../controllers/feed';

const router = Router();

router.get('/posts', getPosts);

export default router;
