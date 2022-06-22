import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const handleAsyncWrap = (func: Function) => {
  return (req: Request, res: Response, next: NextFunction) =>
    func(req, res, next).catch((err: ErrorRequestHandler) => next(err));
};
export default handleAsyncWrap;
