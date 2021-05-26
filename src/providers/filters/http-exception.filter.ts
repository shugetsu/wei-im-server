import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseException } from '../../common/exception/base-exception';
import { ApiCode } from 'src/enums/api-code.enum';
import { I18nConfig } from 'src/config/i18n.config';

/**
 * http 异常过滤器
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const url = request.url;
    const field = I18nConfig.resolverField;
    const lang = request.headers[field] || request.query[field];

    if (exception instanceof BaseException) {
      // 自定义异常
      const status = exception.getStatus();
      const code = exception.getCode();
      const msg = await exception.getTMsg(this.i18n, lang);
      response.status(status).json({ code, msg, url });
    } else {
      // 内部服务器错误
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const code = ApiCode.INTERNAL_SERVER_ERROR;
      const msg = await this.i18n.t('Api.INTERNAL_SERVER_ERROR', { lang });
      response.status(status, { code, msg, url });
    }
  }
}
