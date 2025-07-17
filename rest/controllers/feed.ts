import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/post';

export const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: 'First Post', content: 'This is the first post!', imageUrl: 'images/duck.png', creator: { name: 'Maximilian' }, createdAt: new Date(), _id: randomUUID() }
    ]
  })
}

export const createPost: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: err.array() })
  }
  new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: 'images/duck.jpg',
    creator: { name: 'Maximilian' }
  })
    .save()
    .then(post => res.status(201).json({ message: 'Post created successfully!', post }))
    .catch(err => console.log(err));
}
