import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/messages";
import { redisService } from '../services/redisService';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
  token?: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      id: string;
    };
    
    (req as AuthRequest).user = decoded;
    (req as AuthRequest).token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
  }
};
