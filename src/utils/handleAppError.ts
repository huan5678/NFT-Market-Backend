import { NextFunction } from 'express';
interface ErrorType {
  message?: string;
  statusCode?: number;
  isOperational?: boolean;
}

const appError = (statusCode: number, message: string, next: NextFunction) => {
  const error: ErrorType = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  next(error);
};

export default appError;
