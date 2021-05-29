import { ApiHeader } from '@nestjs/swagger';
import { JwtConfig } from 'src/config/jwt.config';

export function ApiHeaderToken(): MethodDecorator {
  return ApiHeader({
    name: JwtConfig.token.resolverField,
    required: true,
    schema: {
      description: '令牌',
      type: 'string',
    },
  });
}
