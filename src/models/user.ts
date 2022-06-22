import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { passwordRule } from '../utils';

export interface UserInterface extends Document {
  getResetPasswordToken(): string;
  getSignedToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  name: string;
  email: string;
  password: string;
  avatar: string;
  gender: string;
  createdAt: Date;
  googleId: string;
  facebookId: string;
  lineId: string;
  discordId: string;
  isValidator: boolean;
}

const userSchema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email為必要資訊'],
      validate: {
        validator: function (value: string) {
          return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(
            value,
          );
        },
        message: '請填寫正確 email 格式 name@domain.abc',
      },
      unique: true,
      select: false,
    },
    password: {
      type: String,
      minLength: [8, '密碼至少 8 個字'],
      required: [true, '密碼欄位，請確實填寫'],
      validate: {
        validator: function (value: string) {
          return passwordRule.test(value);
        },
        message: '密碼需符合至少有 1 個數字， 1 個大寫英文， 1 個小寫英文',
      },
      select: false,
    },
    name: {
      type: String,
      required: [true, '名稱為必要資訊'],
      minLength: [1, '名稱請大於 1 個字'],
      maxLength: [50, '名稱長度過長，最多只能 50 個字'],
    },
    avatar: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'x'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    facebookId: {
      type: String,
      select: false,
    },
    lineId: {
      type: String,
      select: false,
    },
    discordId: {
      type: String,
      select: false,
    },
    isValidator: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: String,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.pre<UserInterface>('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync(12);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    avatar: this.avatar,
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 24 * 60 * (60 * 1000);
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'following.user',
    select: '-createdAt -isValidator',
  });
  next();
});

const User = mongoose.model<UserInterface>('User', userSchema);
export default User;
