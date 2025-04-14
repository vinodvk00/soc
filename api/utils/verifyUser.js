//middleware to verify user token

import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';


export const verifyToken = (req, res, next) => {
  console.log('Cookies:', req.cookies); // Debugging: Check available cookies
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized please provide a token'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized token invalid'));
    }
    req.user = user;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Access denied: Admins only"));
    }
    next();
  });
};



