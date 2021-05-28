import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Exception } from 'src/common/exception/exception';
import { ApiCode } from 'src/enums/api-code.enum';
import { RegisterDto } from './dtos/register.dto';
import { User } from './user.model';
import * as mongoose from 'mongoose';
import { LoginDto } from './dtos/login.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

  /**
   * 密码加密
   * @param password
   */
  private encryptPassword(email: string, password: string) {
    const tempSalt = Buffer.from(email, 'base64');
    return crypto
      .pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1')
      .toString('base64');
  }

  /**
   * 注册
   * @param data
   */
  async register(data: RegisterDto): Promise<mongoose.Types.ObjectId> {
    const user = await this.getByEmail(data.email);
    if (user) {
      // 用户已存在
      if (!user.isAuthEmail) {
        // 邮箱未认证
        throw new Exception({
          code: ApiCode.EMAIL_REGISTERED_UNVERIFIED,
          msg: {
            i18nKey: 'Api.EMAIL_REGISTERED_UNVERIFIED',
          },
        });
      }
      // 邮箱已注册
      throw new Exception({
        code: ApiCode.EMAIL_REGISTERED,
        msg: {
          i18nKey: 'Api.EMAIL_REGISTERED',
        },
      });
    }

    // 创建用户
    const result = await this.userModel.create({
      ...data,
      password: this.encryptPassword(data.email, data.password),
    });
    if (!result) {
      // 注册失败
      throw new Exception({
        code: ApiCode.REGISTER_FAIL,
        msg: {
          i18nKey: 'Api.REGISTER_FAIL',
        },
      });
    }

    return result._id;
  }

  /**
   * 登录
   */
  async login(data: LoginDto) {
    const user = await this.getByEmail(data.email);
    if (!user) {
      // 账号不存在
      throw new Exception({
        code: ApiCode.LOGIN_FAIL_ACCOUNT_NOT_EXIST,
        msg: {
          i18nKey: 'Api.LOGIN_FAIL_ACCOUNT_NOT_EXIST',
        },
      });
    }

    if (user.password !== this.encryptPassword(data.email, data.password)) {
      // 密码错误
      throw new Exception({
        code: ApiCode.LOGIN_FAIL_PASSWORD_ERROR,
        msg: {
          i18nKey: 'Api.LOGIN_FAIL_PASSWORD_ERROR',
        },
      });
    }

    if (!user.isAuthEmail) {
      // 邮箱未认证
      throw new Exception({
        code: ApiCode.LOGIN_FAIL_EMAIL_UNVERIFIED,
        msg: {
          i18nKey: 'Api.LOGIN_FAIL_EMAIL_UNVERIFIED',
        },
      });
    }

    return user;
  }

  /**
   * 根据邮箱获取用户
   * @param email
   */
  async getByEmail(email: string) {
    const result = await this.userModel.findOne({ email });
    return result;
  }
}
