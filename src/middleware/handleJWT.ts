import jwt from 'jsonwebtoken';
import { User } from '../models';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handleAppError } from '../utils';
import { handleAsyncWrap } from '../middleware';

const jwtSecret = process.env.JWT_SECRET as string;

interface Token {
  id: string;
  name: string;
  avatar: string;
}

export interface UserRequest extends Request {
  user?: any;
}

const isAuthor: RequestHandler = handleAsyncWrap(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const accessToken = req.header('Authorization')?.split('Bearer ').pop();
    if (!accessToken) {
      return handleAppError(401, '未帶入驗證碼，請重新登入！', next);
    }
    try {
      const decoded = jwt.verify(accessToken, jwtSecret) as Token;
      const currentUser = await User.findById(decoded.id).exec();
      req.user = currentUser;
      next();
    } catch (err) {
      return handleAppError(401, '驗證失敗，請重新登入！', next);
    }
  },
);

export { isAuthor };
