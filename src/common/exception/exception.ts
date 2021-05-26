import { I18nService } from 'nestjs-i18n';
import { BaseException, I18nMsg } from './base-exception';

/**
 * 默认异常
 */
export class Exception extends BaseException<I18nMsg> {
  async getTMsg(i18n: I18nService, lang: string) {
    const { i18nKey, args } = this.getMsg();
    return await i18n.t(i18nKey, { lang, args });
  }
}
