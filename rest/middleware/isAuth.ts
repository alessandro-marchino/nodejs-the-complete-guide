import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "process";
import { ErrorWithStatus } from "../models/error-with-status";

export const isAuth: RequestHandler = (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')?.[1] ?? '';
  if(!token) {
    const error: ErrorWithStatus = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken: JwtPayload;
  try {
    decodedToken = verify(token, env.JWT_PRIVATE_KEY!) as JwtPayload;
  } catch(e) {
    const err = e as ErrorWithStatus;
    err.statusCode = 500;
    throw err;
  }
  if(!decodedToken) {
    const error: ErrorWithStatus = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }
  res.locals.userId = decodedToken.userId;
  next();
};
