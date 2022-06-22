import { Response } from 'express';
interface ErrorType {
  statusCode: number;
  name: string;
  message: string;
}
const handleSysError = (err: ErrorType, res: Response) => {
  res.status(err.statusCode || 500).send({
    status: false,
    name: err.name,
    message: err.message,
  });
};

export default handleSysError;
