import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisConfig } from 'src/config/redis.config';
import { User } from '../users/user.model';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    JwtModule.register({
      secret: RedisConfig.mail.secret,
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
