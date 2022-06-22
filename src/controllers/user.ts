import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { User } from '../models';
import { handleAppError, handleAppSuccess, passwordCheck, sendEmail } from '../utils';
import { getLogger } from '@/utils/loggers';
const logger = getLogger('INDEX_ROUTE');

export interface UserRequest extends Request {
  user?: any;
}

const userController = {
  userCreate: async (req: Request, res: Response, next: NextFunction) => {
    logger.info('coming');
    let { email, password, confirmPassword, name } = req.body;
    if (!email || !password || !confirmPassword || !name) {
      return handleAppError(400, '欄位未正確填寫', next);
    }
    if (name.length <= 1) {
      return handleAppError(400, '名字長度至少 2 個字', next);
    }
    if (password.length <= 7 || confirmPassword.length <= 7) {
      return handleAppError(400, '密碼長度至少 8 個字', next);
    }
    if (!validator.isEmail(email)) {
      return handleAppError(400, '請正確輸入 email 格式', next);
    }
    passwordCheck(password, next);
    if (password !== confirmPassword) {
      return handleAppError(400, '請確認兩次輸入的密碼是否相同', next);
    }

    const user = await User.findOne({ email }).exec();
    if (user) {
      return handleAppError(400, '此帳號已有人使用，請試試其他 Email 帳號', next);
    }

    const userData = {
      name,
      email,
      password,
      isValidator: true,
    };
    const currentUser = await User.create(userData);
    const userPayload = {
      id: currentUser._id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    };

    const token = currentUser.getSignedToken;

    return handleAppSuccess(res, '成功建立使用者帳號', { token, user: userPayload });
  },
  userLogin: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleAppError(400, 'email 或 password 欄位未正確填寫', next);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return handleAppError(404, '無此使用者資訊請確認 email 帳號是否正確', next);
    }
    const isMatch: boolean = await user.matchPassword(password);
    if (!isMatch) {
      return handleAppError(400, '請確認密碼是否正確，請再嘗試輸入', next);
    }

    const userPayload = {
      id: user._id,
      name: user.name,
      avatar: user.avatar,
    };
    const token = user.getSignedToken;
    return handleAppSuccess(res, '登入成功', { token, user: userPayload });
  },
  getProfile: async (req: UserRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    return handleAppSuccess(res, '成功取得使用者資訊', user);
  },
  updatePassword: async (req: UserRequest, res: Response, next: NextFunction) => {
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return handleAppError(400, '欄位未正確填寫', next);
    }
    if (password.length <= 7 || confirmPassword.length <= 7) {
      return handleAppError(400, '密碼長度至少 8 個字', next);
    }
    passwordCheck(password, next);
    if (password !== confirmPassword) {
      return handleAppError(400, '請確認兩次輸入的密碼是否相同', next);
    }
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, password);
    return handleAppSuccess(res, '成功更新使用者密碼！', {});
  },
  updateProfile: async (req: UserRequest, res: Response, next: NextFunction) => {
    const { name, avatar, gender } = req.body;
    if (!name && !avatar && !gender) {
      return handleAppError(400, '要修改的欄位未正確填寫', next);
    }
    if (!validator.isURL(avatar)) {
      return handleAppError(400, '請確認照片是否傳入網址', next);
    }
    const userId = req.user.id;
    const userData = { name, avatar, gender };
    await User.findByIdAndUpdate(userId, userData, { runValidators: true });
    const user = await User.findById(userId);
    return handleAppSuccess(res, '成功更新使用者資訊！', user);
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return handleAppError(400, '請填入 email 欄位', next);
    }
    if (!validator.isEmail(email)) {
      return handleAppError(400, '請正確輸入 email 格式', next);
    }
    try {
      const user = await User.findOne({ user: email });
      if (!user) {
        return handleAppError(404, '無此帳號，請再次確認註冊 Email 帳號，或是重新註冊新帳號', next);
      }
      const resetToken = user.getResetPasswordToken();
      await user.save();

      const resetUrl = `${process.env.FRONTEND_RESETPASSWORD_URL}/${resetToken}`;
      const message = `
        <h1> 感謝您使用重置密碼服務 </h1>
        <p>尊貴的<h2>${user.name}</h2> 您好，
          <br />
          我們很高興能協助您重設帳戶。如果需要您協助進行此動作，請依照下列指示進行。
          <br />
          如果您並未要求重設密碼，請忽略此電子郵件。別擔心，您的帳戶很安全。
          <br />
          按一下下列連結，設定新密碼。
          <br />
          此驗證連結僅具一日效力請盡速改改密碼。
          <br />
          <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
          <br />
          如果沒有反應，您可以將連結複製到瀏覽器視窗或直接輸入連結網址。
          <br />
          團隊敬上
        </p>
        `;
      try {
        sendEmail({
          to: user.email,
          text: message,
          subject: '密碼重設驗證通知信',
        });
        handleAppSuccess(res, '成功送出重置信', '');
      } catch (error: any) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return handleAppError(500, error, next);
      }
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
