import { Application } from "jsr:@oak/oak/application";
import todosRoutes from './routes/todos.ts';

const app = new Application();

app.use(async (ctx, next) => {
  // CORS
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods())

await app.listen({ port: 8000 });
