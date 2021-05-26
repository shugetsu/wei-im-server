import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nConfig } from 'src/config/i18n.config';
import { ApiCode } from '../../enums/api-code.enum';

// 返回的数据格式
interface Response<T> {
  code: ApiCode;
  msg: string;
  data: T;
}

/**
 * Response 拦截器
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private readonly i18n: I18nService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const field = I18nConfig.resolverField;
    const lang = request.headers[field] || request.query[field];
    const code = ApiCode.OK;
    const msg = await this.i18n.t('Api.OK', { lang });
    return next.handle().pipe(
      map((data) => {
        return { code, msg, data };
      }),
    );
  }
}
