import { randomUUID } from 'crypto';
import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

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
  const { title, content } = req.body;
  res.status(201).json({
    message: 'Post created successfully!',
    post: { _id: randomUUID(), title, content, creator: { name: 'Maximilian', createdAt: new Date() } }
  })
}
