import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import feedRouter from './routes/feed.js';

import { connect } from 'mongoose';

const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}?authSource=${process.env.MONGODB_AUTH_SOURCE}`;

const app = express();

app.use(bodyParser.json());
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/feed', feedRouter);
connect(MONGODB_URI)
  .then(() => app.listen(8080))
  .then(() => console.log('App listening on port 8080'))
  .catch(err => console.error(err));
