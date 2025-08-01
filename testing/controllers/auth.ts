import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from 'process';
import { ErrorWithStatus } from '../models/error-with-status';
import { User } from '../models/user';

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.') as ErrorWithStatus;
    error.statusCode = 422;
    error.payload = errors.array();
    throw error;
  }
  try {
    const hashedPw = await hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password: hashedPw,
      name: req.body.name
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err: any) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error('User not found.') as ErrorWithStatus;
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await compare(req.body.password, user.password);
    if (!isEqual) {
      const error = new Error('User not found.') as ErrorWithStatus;
      error.statusCode = 401;
      throw error;
    }
    const token = sign({ email: user.email, userId: user._id.toString() }, env.JWT_PRIVATE_KEY as string, { expiresIn: '1h' } );
    res.status(200).json({ token, userId: user._id.toString() });
    return;
  } catch (err) {
    next(err);
    return err;
  }
};

export const getUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.') as ErrorWithStatus;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.') as ErrorWithStatus;
      error.statusCode = 404;
      throw error;
    }
    user.status = req.body.status;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    next(err);
  }
};
