import { Router } from "express";
import { Todo } from "../models/todo";
import { randomUUID } from "node:crypto";

const MY_TODOS: Todo[] = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: MY_TODOS });
});

router.post('/', (req, res, next) => {
  const newTodo: Todo = { id: randomUUID(), text: req.body.text };
  MY_TODOS.push(newTodo);
  res.status(201);
})

export default router;
