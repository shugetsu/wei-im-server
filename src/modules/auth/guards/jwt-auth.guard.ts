import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseException } from 'src/common/exception/base-exception';
import { Exception } from 'src/common/exception/exception';
import { JwtConfig } from 'src/config/jwt.config';
import { ApiCode } from 'src/enums/api-code.enum';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpc = context.switchToRpc();
    const data = rpc.getData();
    const tokenField = JwtConfig.token.resolverField;
    const token = (data.headers[tokenField] || '').replace('Bearer ', '');

    if (!token) {
      // 未授权
      throw new Exception({
        code: ApiCode.UNAUTHORIZED,
        msg: {
          i18nKey: 'Api.UNAUTHORIZED',
        },
      });
    }

    let tokenPayload;
    try {
      // 解密 Token
      tokenPayload = this.authService.decodeToken(token);
    } catch (err) {
      // token 无效
      throw new Exception({
        code: ApiCode.TOKEN_INVALID,
        msg: {
          i18nKey: 'Api.TOKEN_INVALID',
        },
      });
    }

    const cacheKey = this.authService.formatTokenCacheKey(tokenPayload);
    const cacheToken = await this.authService.getCacheTokenByKey(cacheKey);
    if (token !== cacheToken) {
      // token 已过期
      throw new Exception({
        code: ApiCode.TOKEN_EXPIRED,
        msg: {
          i18nKey: 'Api.TOKEN_EXPIRED',
        },
      });
    }

    // 续签 Token
    await this.authService.renewalToken(tokenPayload, token);

    return true;
  }
}
