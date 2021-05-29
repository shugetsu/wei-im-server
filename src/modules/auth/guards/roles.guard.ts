import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Exception } from 'src/common/exception/exception';
import { JwtConfig } from 'src/config/jwt.config';
import { ApiCode } from 'src/enums/api-code.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { UsersService } from 'src/modules/users/users.service';
import { ROLES_KEY } from 'src/providers/decorators/roles-decorator';
import { AuthService, TokenPayload } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // 不需要鉴权
      return true;
    }

    const { headers } = context.switchToHttp().getRequest();
    const tokenField = JwtConfig.token.resolverField;
    const token = (headers[tokenField] || '').replace('Bearer ', '');

    if (!token) {
      // 未授权
      throw new Exception({
        code: ApiCode.UNAUTHORIZED,
        msg: {
          i18nKey: 'Api.UNAUTHORIZED',
        },
      });
    }

    let tokenPayload: TokenPayload;
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

    const user = await this.usersService.getCacheUserByKey(tokenPayload.userId);
    if (!user) {
      // 鉴权失败
      throw new Exception({
        code: ApiCode.AUTHENTICATION_FAIL,
        msg: {
          i18nKey: 'Api.AUTHENTICATION_FAIL',
        },
      });
    }

    // 续签 Token
    await this.authService.renewalToken(tokenPayload, token);

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
