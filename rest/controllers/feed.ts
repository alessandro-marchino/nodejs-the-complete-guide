import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { Post } from '../models/post';
import { ErrorWithStatus } from '../models/error-with-status';
import { join } from 'path';
import { unlink } from 'fs';
import { User } from '../models/user';
import { getIO } from '../util/socket';

export const getPosts: RequestHandler = async (req, res, next) => {
  const currentPage = +(req.query.page || 1);
  const perPage = 2;
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({ message: 'Fetched posts successfully.', posts, totalItems })
  } catch(err) {
    next(err);
  }
}

export const createPost: RequestHandler = async (req, res, next) => {
  try {
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
    const post = await new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file.path,
      creator: res.locals.userId
    }).save();
    const creator = await User.findById(res.locals.userId);
    creator!.posts.push(post._id);
    await creator!.save();
    getIO().emit('posts', { action: 'create', post });
    return res.status(201).json({ message: 'Post created successfully!', post, creator });
  } catch(err) {
    next(err);
  }
}

export const getPost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId)
      .populate('creator');
    if(!post) {
      const error: ErrorWithStatus = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ message: 'Post fetched.', post });
  } catch(err) {
    next(err)
  }
}

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
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
    const post = await Post.findById(postId);
    if(!post) {
      const error: ErrorWithStatus = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if(!post.creator.equals(res.locals.userId)) {
      const error: ErrorWithStatus = new Error('Not authorized.');
      error.statusCode = 403;
      throw error;
    }
    if(imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.imageUrl = imageUrl;
    const savedPost = await post.save();
    return res.status(200).json({ message: 'Post updated successfully!', post: savedPost });
  } catch(err) {
    next(err);
  }
}

export const deletePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  try {
  const post = await Post.findById(postId);
    // Check logged in user
    if(!post) {
      const error: ErrorWithStatus = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if(!post.creator.equals(res.locals.userId)) {
      const error: ErrorWithStatus = new Error('Not authorized.');
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await post.deleteOne();
    const user = await User.findById(res.locals.userId);
    user!.posts = user!.posts.filter(p => !p._id.equals(postId));
    await user!.save();
    return res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (err) {
    next(err);
  }
}

function clearImage(filePath: string): void {
  const completeFilePath = join(__dirname, '..', filePath);
  unlink(completeFilePath, err => {
    if(err) {
      console.log(err)
    }
  });
}
