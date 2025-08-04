import express from 'express';
import todosRoutes from './routes/todos';
import { json } from 'body-parser';

const app = express();
app.use(json())
app.use('/todos', todosRoutes);
app.listen(3000);
