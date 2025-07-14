import express from 'express';
import feedRouter from './routes/feed';

const app = express();
app.use('/feed', feedRouter);
app.listen(8080);
