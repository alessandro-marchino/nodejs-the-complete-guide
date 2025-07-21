import { type RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/user';
import { type ErrorWithStatus } from '../models/error-with-status';

export const putSignup: RequestHandler = (req, res, next) => {
  const err = validationResult(req);
  if(!err.isEmpty()) {
    const error: ErrorWithStatus = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    error.payload = err.array();
    throw error;
  }
  const password = req.body.password;
}
