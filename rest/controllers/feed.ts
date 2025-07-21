import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/post';
import { ErrorWithStatus } from '../models/error-with-status';
import { join } from 'path';
import { unlink } from 'fs';

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

export const updatePost: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.payload = err.array();
    throw error;
  }
  let imageUrl = req.body.image;
  if(req.file) {
    imageUrl = req.file.path;
  }
  if(!imageUrl) {
    const error: ErrorWithStatus = new Error('No file provided.');
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if(!post) {
        const error: ErrorWithStatus = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      if(imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = req.body.title;
      post.content = req.body.content;
      post.imageUrl = imageUrl;
      return post.save()
    })
    .then(post => res.status(200).json({ message: 'Post updated successfully!', post }))
    .catch(err => next(err));
}

function clearImage(filePath: string): void {
  const completeFilePath = join(__dirname, '..', filePath);
  unlink(completeFilePath, err => {
    if(err) {
      console.log(err)
    }
  });
}
