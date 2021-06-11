import { ApiHeader } from '@nestjs/swagger';
import { RedisConfig } from 'src/config/redis.config';

export function ApiHeaderToken(): MethodDecorator {
  return ApiHeader({
    name: RedisConfig.token.resolverField,
    required: true,
    schema: {
      description: '令牌',
      type: 'string',
    },
  });
}
