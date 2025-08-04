import express from 'express';
import todosRoutes from './routes/todos';

const app = express();
app.use('/todos', todosRoutes);
app.listen(3000);
