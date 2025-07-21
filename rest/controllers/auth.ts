import { type RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { User, UserType } from '../models/user';
import { type ErrorWithStatus } from '../models/error-with-status';
import { compare, hash } from 'bcryptjs';
import { Document, Types } from 'mongoose';

export const putSignup: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.payload = err.array();
    throw error;
  }
  hash(req.body.password, 12)
    .then(hashedPassword => new User({ email: req.body.email, password: hashedPassword, name: req.body.name }).save())
    .then(user => res.status(201).json({ message: 'User created', userId: user._id }))
    .catch(err => next(err));
}

export const postLogin: RequestHandler = (req, res, next) => {
  let loadedUser: UserType;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user) {
        const error: ErrorWithStatus = new Error('Login error.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return compare(req.body.password, user.password);
    })
    .then(isEquals => {
      if(!isEquals) {
        const error: ErrorWithStatus = new Error('Login error.');
        error.statusCode = 401;
        throw error;
      }
      // Correct password
    })
    .catch(err => next(err));
}
