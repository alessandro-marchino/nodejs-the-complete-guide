import express from 'express';
import bodyParser from 'body-parser';
import feedRouter from './routes/feed.js';
import { join } from 'path';

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/feed', feedRouter);
app.listen(8080, () => {
  console.log('App listening on port 8080')
});
