import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Exception } from 'src/common/exception/exception';
import { ApiCode } from 'src/enums/api-code.enum';
import { RegisterDto } from './dtos/register.dto';
import { User } from './user.model';
import * as mongoose from 'mongoose';
import { LoginDto } from './dtos/login.dto';
import * as crypto from 'crypto';
import { AuthService } from '../auth/auth.service';
import { Cache } from 'cache-manager';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { MailService } from '../mail/mail.service';
import e from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ModelType<User>,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly i18n: I18nRequestScopeService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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
    const user = await this.userModel.findOne({ email: data.email });
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

    return result.id;
  }

  /**
   * 登录
   */
  async login(data: LoginDto) {
    const projection = ['+password'];
    const user = await this.userModel.findOne(
      { email: data.email },
      projection,
    );

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

    const tokenPayload = { userId: user.id, device: data.device };
    // 生成 Token
    const token = this.authService.generateToken(tokenPayload);
    // 缓存 Token
    const cacheTokenResult = await this.authService.saveTokenToCache(
      tokenPayload,
      token,
    );
    if (!cacheTokenResult) {
      // 缓存异常
      throw new Exception({
        code: ApiCode.LOGIN_FAIL_CACHE_EXCEPTION,
        msg: {
          i18nKey: 'Api.LOGIN_FAIL_CACHE_EXCEPTION',
        },
      });
    }

    // 缓存用户
    const cacheUserResult = await this.savaUserToCache(user.id, user);
    if (!cacheUserResult) {
      // 缓存异常
      throw new Exception({
        code: ApiCode.LOGIN_FAIL_CACHE_EXCEPTION,
        msg: {
          i18nKey: 'Api.LOGIN_FAIL_CACHE_EXCEPTION',
        },
      });
    }

    return { token };
  }

  /**
   * 保存用户到缓存
   * @param userId
   * @param user
   */
  async savaUserToCache(key: string, user: User) {
    const result = (await this.cacheManager.set(`${key}`, user, {
      ttl: 0,
    })) as unknown;
    return (result as string) === 'OK';
  }

  /**
   * 根据 key 获取缓存的用户
   * @param key
   */
  async getCacheUserByKey(key: string): Promise<User> {
    return await this.cacheManager.get(`${key}`);
  }

  /**
   * 根据邮箱获取用户
   * @param email
   */
  async getUserByEmail(email: string) {
    const result = await this.userModel.findOne({ email });
    if (!result) {
      throw new Exception({
        code: ApiCode.USER_NOT_EXIST,
        msg: {
          i18nKey: 'Api.USER_NOT_EXIST',
        },
      });
    }
    return result;
  }

  /**
   * 获取用户信息
   * @param id
   */
  async getUserById(id: string) {
    const result = await this.userModel.findById(id);
    if (!result) {
      throw new Exception({
        code: ApiCode.USER_NOT_EXIST,
        msg: {
          i18nKey: 'Api.USER_NOT_EXIST',
        },
      });
    }
    return result;
  }

  async validateEmail(activateCode: string) {
    //   const passResult = {
    //     pageTitle: await this.i18n.t('Mail.validateEmailPageTitle'),
    //     title: await this.i18n.t('Mail.validateEmailPass.title'),
    //     tip: await this.i18n.t('Mail.validateEmailPass.tip'),
    //   };
    //   const notPassResult = {
    //     pageTitle: await this.i18n.t('Mail.validateEmailPageTitle'),
    //     title: await this.i18n.t('Mail.validateEmailNotPass.title'),
    //     tip: await this.i18n.t('Mail.validateEmailNotPass.tip'),
    //   };
    //   const email = this.mailService.verifyActivateCode(activateCode);
    //   if (!email) {
    //     return notPassResult;
    //   }
    //   const user = await this.userModel.findOne({ email });
    //   if (!user) {
    //     // 用户不存在
    //     return notPassResult;
    //   }
    //   if (user.isAuthEmail) {
    //     // 邮箱已认证
    //     return passResult;
    //   }
    //   const result = await this.userModel.updateOne({ email, isAuthEmail: true });
    //   if (!result) {
    //     // 认证失败
    //     return notPassResult;
    //   }
    //   return passResult;
  }
}
