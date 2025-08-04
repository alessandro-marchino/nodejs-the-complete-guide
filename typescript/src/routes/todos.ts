import { Router } from "express";

const TODOS: any[] = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: TODOS });
});

export default router;
