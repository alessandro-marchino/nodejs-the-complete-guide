import express from 'express';
import bodyParser from 'body-parser';
import feedRouter from './routes/feed.js';

const app = express();

app.use(bodyParser.json());

app.use('/feed', feedRouter);
app.listen(8080);
