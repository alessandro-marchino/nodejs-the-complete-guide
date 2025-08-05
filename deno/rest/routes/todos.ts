import { Router } from "jsr:@oak/oak/router";

interface Todo { id: string; text: string; };

let todos: Todo[] = [];

const router = new Router();

router.get('/todos', ctx => {
  ctx.response.status = 200;
  ctx.response.body = { todos };
});
router.post('/todos', async ctx => {
  const data = await ctx.request.body.json();
  const newTodo: Todo = { id: crypto.randomUUID(), text: data.text };
  todos.push(newTodo);
  ctx.response.status = 201;
  ctx.response.body = { message: 'Created TODO', todo: newTodo };
});
router.get('/todos/:id', ctx => {
  const todo = todos.find(todo => todo.id == ctx.params.id);
  if(!todo) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'TODO not found' };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = { todo };
});
router.put('/todos/:id', async ctx => {
  const todoIndex = todos.findIndex(todo => todo.id == ctx.params.id);
  if(todoIndex === -1) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'TODO not found' };
    return;
  }
  const data = await ctx.request.body.json();
  todos[todoIndex] = { ...todos[todoIndex]!, text: data.text };
  ctx.response.status = 200;
  ctx.response.body = { message: 'Updated TODO', todo: todos[todoIndex] };
});
router.delete('/todos/:id', ctx => {
  todos = todos.filter(todo => todo.id !== ctx.params.id);
  ctx.response.status = 200;
  ctx.response.body = { message: 'Deleted TODO' };
});

export default router;
