import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "process";
import { ErrorWithStatus } from "../models/error-with-status";

export const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.') as ErrorWithStatus;
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  const decodedToken = verify(token, env.JWT_PRIVATE_KEY as string)as JwtPayload;
  if (!decodedToken) {
    const error = new Error('Not authenticated.') as ErrorWithStatus;
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
