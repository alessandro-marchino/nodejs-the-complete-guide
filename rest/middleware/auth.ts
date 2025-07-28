import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { env } from "process";

export const auth: RequestHandler = (req, res, next) => {
  req.isAuth = false;
  const token = req.get('Authorization')?.split(' ')?.[1] ?? '';
  if(!token) {
    return next();
  }
  let decodedToken: JwtPayload;
  try {
    decodedToken = verify(token, env.JWT_PRIVATE_KEY!) as JwtPayload;
  } catch(e) {
    return next();
  }
  if(!decodedToken) {
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
