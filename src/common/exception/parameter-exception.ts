import { I18nService } from 'nestjs-i18n';
import {
  BaseException,
  I18nParameterMsgs,
  I18nParameterMsg,
  I18nMsg,
} from './base-exception';

/**
 * 参数异常
 */
export class ParameterException extends BaseException<I18nParameterMsgs> {
  async getTMsg(i18n: I18nService, lang: string) {
    const msgs = this.getMsg();
    const result = msgs.map((msg) => {
      return this.createParameterErrorItem(i18n, lang, msg);
    });
    return await Promise.all(result);
  }

  private async createParameterErrorItem(
    i18n: I18nService,
    lang: string,
    msg: I18nParameterMsg,
  ) {
    const messages = await this.tParameterErrorItemMessages(
      i18n,
      lang,
      msg.messages,
    );
    return { field: msg.field, messages };
  }

  private async tParameterErrorItemMessages(
    i18n: I18nService,
    lang: string,
    messages: I18nMsg[],
  ) {
    const result = messages.map((message) => {
      const { i18nKey, args } = message;
      return i18n.t(i18nKey, { lang, args });
    });
    return await Promise.all(result);
  }
}
