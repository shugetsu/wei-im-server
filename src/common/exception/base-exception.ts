import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ApiCode } from 'src/enums/api-code.enum';

export interface I18nMsg {
  i18nKey: string;
  args?: Record<string, any>;
}

export interface I18nParameterMsg {
  field: string;
  messages: I18nMsg[];
}

export type I18nParameterMsgs = I18nParameterMsg[];

export interface ExceptionOptions<T> {
  status?: HttpStatus;
  code: ApiCode;
  msg: T;
}

/**
 * 自定义异常基类
 */
export abstract class BaseException<
  T extends I18nMsg | I18nParameterMsgs,
> extends HttpException {
  private readonly msg: T;
  private readonly code: ApiCode;

  constructor(options: ExceptionOptions<T>) {
    super(options.msg, options.status || HttpStatus.OK);
    this.code = options.code;
    this.msg = options.msg;
  }

  abstract getTMsg(i18n: I18nService, lang: string);

  getMsg() {
    return this.msg;
  }

  getCode() {
    return this.code;
  }
}
