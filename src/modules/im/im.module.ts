import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ImGateway } from './im.gateway';

@Module({
  imports: [AuthModule],
  providers: [ImGateway],
})
export class ImModule {}
