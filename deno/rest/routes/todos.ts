import { Router } from "jsr:@oak/oak/router";
import { getDb } from '../helpers/db_clients.ts';
import { ObjectId } from "npm:mongodb@5.6.0";

interface Todo { id: string; text: string; };

const router = new Router();

router.get('/todos', async ctx => {
  const fetchedTodos = await getDb().collection('todos').find().toArray();
  const todos = fetchedTodos.map(todo => ({ id: todo._id.toString(), text: todo.text }));

  ctx.response.status = 200;
  ctx.response.body = { todos };
});
router.post('/todos', async ctx => {
  const data = await ctx.request.body.json();
  const newTodo: Partial<Todo> = { text: data.text };
  const result = await getDb().collection('todos').insertOne(newTodo);
  ctx.response.status = 201;
  ctx.response.body = { message: 'Created TODO', todo: { id: result.insertedId, text: newTodo.text } };
});
router.get('/todos/:id', async ctx => {
  const todo = await getDb().collection('todos').findOne({ _id: new ObjectId(ctx.params.id) });
  if(!todo) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'TODO not found' };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = { todo: { id: todo._id.toString(), text: todo.text } };
});
router.put('/todos/:id', async ctx => {
  const data = await ctx.request.body.json();
  const result = await getDb().collection('todos').updateOne({ _id: new ObjectId(ctx.params.id) }, { $set: { text: data.text } });
  if (result.matchedCount === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'TODO not found' };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = { message: 'Updated TODO' };
});
router.delete('/todos/:id', async ctx => {
  const result = await getDb().collection('todos').deleteOne({ _id: new ObjectId(ctx.params.id) });
  if (result.deletedCount === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: 'TODO not found' };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = { message: 'Deleted TODO' };
});

export default router;
