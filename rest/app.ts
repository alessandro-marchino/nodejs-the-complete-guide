import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';
import { randomUUID } from 'crypto';
import multer, { diskStorage, FileFilterCallback } from 'multer';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

import { ErrorWithStatus } from './models/error-with-status';
import graphQLSchema from './graphql/schema';
import graphQLResolver from './graphql/resolvers';
import { GraphQLError } from 'graphql';
import { auth } from './middleware/auth';

const MONGODB_URI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PWD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DBNAME}?authSource=${process.env.MONGODB_AUTH_SOURCE}`;

const app = express();
const fileStorage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    callback(null, `${randomUUID()}-${file.originalname}`);
  }
});
const fileFilter = (req: Request, file: Express.Multer.File,  cb: FileFilterCallback) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    return cb(null, true);
  }
  return cb(null, false);
};

app.use('/images', express.static(join(__dirname, 'images')))

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if(req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message;
  res.status(statusCode).json({ message, payload: err.payload });
});

app.post('/graphql', auth, createHandler({
  schema: graphQLSchema,
  rootValue: graphQLResolver,
  formatError(err) {
    if(!(err as GraphQLError).originalError) {
      return err;
    }
    const payload = ((err as GraphQLError)?.originalError as ErrorWithStatus)?.payload;
    const message = err.message || 'An error occurred'
    const status = ((err as GraphQLError)?.originalError as ErrorWithStatus)?.statusCode || 500;
    return { name: '', message, status, payload };
  }
}));

app.get('/graphql', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

connect(MONGODB_URI)
  .then(() => app.listen(8080, () => console.log('App listening on port 8080')))
  .catch(err => console.error(err));
