import { randomUUID } from 'crypto';

/** @type {import('express').RequestHandler} */
export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: 'First Post', content: 'This is the first post!' }
    ]
  })
}

/** @type {import('express').RequestHandler} */
export const createPost = (req, res, next) => {
  const { title, content } = req.body;
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: randomUUID(), title, content }
  })
}
