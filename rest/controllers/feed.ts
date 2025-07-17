import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/post';
import { ErrorWithStatus } from '../models/error-with-status';

export const getPosts: RequestHandler = (req, res, next) => {
  Post.find()
    .then(posts => res.status(200).json({ posts }));
  // res.status(200).json({
  //   posts: [
  //     { title: 'First Post', content: 'This is the first post!', imageUrl: 'images/duck.png', creator: { name: 'Maximilian' }, createdAt: new Date(), _id: randomUUID() }
  //   ]
  // })
}

export const createPost: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    error.payload = err.array();
    throw error;
  }
  new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: 'images/duck.png',
    creator: { name: 'Maximilian' }
  })
    .save()
    .then(post => res.status(201).json({ message: 'Post created successfully!', post }))
    .catch(err => next(err));
}
