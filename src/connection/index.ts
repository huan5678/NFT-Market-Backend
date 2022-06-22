import mongoose from 'mongoose';
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '../config';
import { getLogger } from '@/utils/loggers';
const logger = getLogger('CONNECTION');

const DB: string = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

export const connectDB = async () => {
  await mongoose.connect(DB);
  logger.info('資料庫連線成功');
};
