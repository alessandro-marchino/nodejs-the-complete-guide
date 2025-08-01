import { RequestHandler } from "express";
import { Post } from "../models/post";
import { validationResult } from "express-validator";
import { ErrorWithStatus } from "../models/error-with-status";
import { User } from "../models/user";
import { clearImage } from "../util/file";

const PER_PAGE = 2;

export const getPosts: RequestHandler = async (req, res, next) => {
  const currentPage = +(req.query.page || 1);
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    res.status(200).json({ message: 'Fetched posts successfully.', posts, totalItems });
  } catch (err) {
    next(err);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.') as ErrorWithStatus;
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.') as ErrorWithStatus;
    error.statusCode = 422;
    throw error;
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path,
    creator: req.userId
  });
  try {
    await post.save();
    const user = (await User.findById(req.userId))!;
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({ message: 'Post created successfully!', post, creator: { _id: user._id.toString(), name: user.name } });
  } catch (err) {
    next(err);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  try {
    if (!post) {
      const error = new Error('Could not find post.') as ErrorWithStatus;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post });
  } catch (err) {
    next(err);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.') as ErrorWithStatus;
    error.statusCode = 422;
    throw error;
  }
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.') as ErrorWithStatus;
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      const error = new Error('Could not find post.') as ErrorWithStatus;
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!') as ErrorWithStatus;
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = req.body.title;
    post.imageUrl = imageUrl;
    post.content = req.body.content;
    const result = await post.save();
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    next(err);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      const error = new Error('Could not find post.') as ErrorWithStatus;
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!') as ErrorWithStatus;
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    clearImage(post.imageUrl);
    await post.deleteOne();

    const user = (await User.findById(req.userId))!;
    user.posts = user.posts.filter(post => !post._id.equals(req.params.postId));
    await user.save();
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    next(err);
  }
};
