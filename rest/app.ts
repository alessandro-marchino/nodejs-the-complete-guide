import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';
import multer, { diskStorage, FileFilterCallback } from 'multer';

import feedRouter from './routes/feed';
import authRouter from './routes/auth';

import { ErrorWithStatus } from './models/error-with-status';
import { randomUUID } from 'crypto';
import { isAuth } from './middleware/isAuth';

import { Server } from 'socket.io';

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
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/feed', isAuth, feedRouter);
app.use('/auth', authRouter);

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message;
  res.status(statusCode).json({ message, payload: err.payload });
})

connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(8080);
    const io = new Server(server);

    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
  .then(() => console.log('App listening on port 8080'))
  .catch(err => console.error(err));
