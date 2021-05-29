import { CacheModule, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisConfig } from 'src/config/redis.config';
import { AuthModule } from '../auth/auth.module';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    CacheModule.register({
      store: redisStore,
      host: RedisConfig.host,
      port: RedisConfig.port,
      db: RedisConfig.userDB,
    }),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
