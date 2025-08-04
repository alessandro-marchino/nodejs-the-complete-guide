import { Router } from "express";
import { Todo } from "../models/todo";
import { randomUUID } from "node:crypto";

let MY_TODOS: Todo[] = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: MY_TODOS });
});

router.post('/', (req, res, next) => {
  const newTodo: Todo = { id: randomUUID(), text: req.body.text };
  MY_TODOS.push(newTodo);
  res.status(201).json({ message: 'Added todo', todo: newTodo, todos: MY_TODOS });
});

router.put('/:id', (req, res, next) => {
  const originalTodoIndex = MY_TODOS.findIndex(todo => todo.id === req.params.id);
  if(originalTodoIndex === -1) {
    return res.status(404).json({ message: 'Could not find todo for this id '});
  }
  MY_TODOS[originalTodoIndex] = { ...MY_TODOS[originalTodoIndex]!, text: req.body.text };
  res.status(200).json({ message: 'Updated todo', todos: MY_TODOS });
});

router.delete('/:id', (req, res, next) => {
  MY_TODOS = MY_TODOS.filter(todo => todo.id !== req.params.id);
  res.status(200).json({ message: 'Deleted todo', todos: MY_TODOS });
});

router.get('/:id', (req, res, next) => {
  const originalTodoIndex = MY_TODOS.findIndex(todo => todo.id === req.params.id);
  if(originalTodoIndex === -1) {
    return res.status(404).json({ message: 'Could not find todo for this id '});
  }
  res.status(200).json({ todo: MY_TODOS[originalTodoIndex] });
});

export default router;
