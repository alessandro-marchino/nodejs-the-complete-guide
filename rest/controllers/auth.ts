import { type RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { User, UserDocument } from '../models/user';
import { type ErrorWithStatus } from '../models/error-with-status';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from 'process';

export const putSignup: RequestHandler = async (req, res, next) => {
  const err = validationResult(req);
  try {
    if(!err.isEmpty()) {
      const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.payload = err.array();
      throw error;
    }
    const hashedPassword = await hash(req.body.password, 12);
    const user = await new User({ email: req.body.email, password: hashedPassword, name: req.body.name }).save();
    return res.status(201).json({ message: 'User created', userId: user._id });
  } catch(err) {
    next(err);
  }
}

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const user: UserDocument | null = await User.findOne({ email: req.body.email });
    if(!user) {
      const error: ErrorWithStatus = new Error('Login error.');
      error.statusCode = 401;
      throw error;
    }
    const isEquals = await compare(req.body.password, user.password);
    if(!isEquals) {
      const error: ErrorWithStatus = new Error('Login error.');
      error.statusCode = 401;
      throw error;
    }
    // Correct password
    const token = sign(
      { email: user.email, userId: user._id.toString() },
      env.JWT_PRIVATE_KEY!,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ token, userId: user._id.toString() });
  } catch(err) {
    next(err);
  }
}

export const getStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.userId)
    return res.status(200).json({ message: 'Status fetched correctly.', status: user?.status});
  } catch(err) {
    next(err);
  }
}

export const patchStatus: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(res.locals.userId);
    user!.status = req.body.status;
    await user?.save();
    return res.status(200).json({ message: 'Status updated successfully.'});
  } catch(err) {
    next(err);
  }
}
