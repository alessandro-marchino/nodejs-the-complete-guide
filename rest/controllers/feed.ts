import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/post';
import { ErrorWithStatus } from '../models/error-with-status';

export const getPosts: RequestHandler = (req, res, next) => {
  Post.find()
    .then(posts => res.status(200).json({ message: 'Fetched posts successfully.', posts }))
    .catch(err => next(err));
}

export const createPost: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.payload = err.array();
    throw error;
  }
  if(!req.file) {
    const error: ErrorWithStatus = new Error('No file provided.');
    error.statusCode = 422;
    throw error;
  }
  new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path,
    creator: { name: 'Maximilian' }
  })
    .save()
    .then(post => res.status(201).json({ message: 'Post created successfully!', post }))
    .catch(err => next(err));
}

export const getPost: RequestHandler = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const error: ErrorWithStatus = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post });
    })
    .catch(err => next(err));
}
