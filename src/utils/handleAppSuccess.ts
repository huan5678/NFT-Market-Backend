import { Response } from 'express';

const handleAppSuccess = (res: Response, message = '', data: object | any) => {
  data
    ? res.send({
        status: true,
        message: message,
        data,
      })
    : res.send({
        status: true,
        message: message,
      });
};

export default handleAppSuccess;
