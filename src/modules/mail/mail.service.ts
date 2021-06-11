import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { JwtService } from '@nestjs/jwt';
import { RedisConfig } from 'src/config/redis.config';
import { Exception } from 'src/common/exception/exception';
import { ApiCode } from 'src/enums/api-code.enum';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { User } from '../users/user.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: I18nRequestScopeService,
    private readonly jwtService: JwtService,
    @InjectModel(User) private readonly userModel: ModelType<User>,
  ) {}

  /**
   * 发送激活邮件
   * @param email
   * @param lang
   */
  public async sendActivateMail(email: string, lang: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // 无法发送激活邮件，邮箱未注册
      throw new Exception({
        code: ApiCode.UNABLE_SEND_ACTIVATE_MAIL_EMAIL_NOT_REGISTERED,
        msg: {
          i18nKey: 'Api.UNABLE_SEND_ACTIVATE_MAIL_EMAIL_NOT_REGISTERED',
        },
      });
    }

    if (user.isAuthEmail) {
      // 无法发送激活邮件，邮箱已认证
      throw new Exception({
        code: ApiCode.UNABLE_SEND_ACTIVATE_AUTHENTICATED,
        msg: {
          i18nKey: 'Api.UNABLE_SEND_ACTIVATE_AUTHENTICATED',
        },
      });
    }

    const subject = await this.i18n.t('Mail.validateEmail.subject');
    const hello = await this.i18n.t('Mail.validateEmail.hello');
    const whyVerify = await this.i18n.t('Mail.validateEmail.whyVerify');
    const unregistered = await this.i18n.t('Mail.validateEmail.unregistered');
    const team = await this.i18n.t('Mail.validateEmail.team');
    const clickActivate = await this.i18n.t('Mail.validateEmail.clickActivate');
    const safety = await this.i18n.t('Mail.validateEmail.safety', {
      args: { number: RedisConfig.mail.activateMailTTL },
    });
    const activateCode = this.jwtService.sign(
      { email },
      { expiresIn: RedisConfig.mail.activateMailTTL * 60 * 60 },
    );

    // 验证邮箱地址
    const validateEmailUrl = `${RedisConfig.mail.validateEmailUrl}?lang=${lang}&activateCode=${activateCode}`;
    // 发送邮件
    const result = await this.mailerService.sendMail({
      to: email,
      subject,
      template: './activate_mail',
      context: {
        validateEmailUrl,
        hello,
        safety,
        clickActivate,
        whyVerify,
        unregistered,
        team,
      },
    });

    if (!result.accepted.length) {
      // 激活邮件发送失败，对方拒收
      throw new Exception({
        code: ApiCode.ACTIVATE_MAIL_SEND_FAIL_REJECTED,
        msg: {
          i18nKey: 'Api.ACTIVATE_MAIL_SEND_FAIL_REJECTED',
        },
      });
    }

    return validateEmailUrl;
  }

  /**
   * 解密激活码
   * @param activateCode
   */
  verifyActivateCode(activateCode: string) {
    try {
      const result = this.jwtService.verify(activateCode);
      return result.email;
    } catch (err) {
      return null;
    }
  }
}
