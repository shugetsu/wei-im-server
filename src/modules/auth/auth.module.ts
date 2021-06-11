import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisConfig } from 'src/config/redis.config';
import { AuthService } from './auth.service';
import * as redisStore from 'cache-manager-redis-store';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: RedisConfig.token.secret,
    }),
    CacheModule.register({
      store: redisStore,
      host: RedisConfig.host,
      port: RedisConfig.port,
      db: RedisConfig.token.dbName,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
