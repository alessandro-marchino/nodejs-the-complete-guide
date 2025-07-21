import { type RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/user';
import { type ErrorWithStatus } from '../models/error-with-status';
import { hash } from 'bcryptjs';

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
