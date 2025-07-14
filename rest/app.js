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
app.listen(8080);

const fe = express();
fe.use(express.static(join(import.meta.dirname, 'public')));
fe.get('', (req, res, next) => res.send('<script src="index.js" defer></script><button id="get">Get Posts</button><button id="post">Create a Post</button>'));
fe.listen(3000);
