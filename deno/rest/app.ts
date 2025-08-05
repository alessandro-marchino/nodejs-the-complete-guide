import { Application } from "jsr:@oak/oak/application";
import todosRoutes from './routes/todos.ts';

const app = new Application();

app.use(async (_, next) => {
  console.log('Middleware');
  await next();
});

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods())

await app.listen({ port: 3000 });
