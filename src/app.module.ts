import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule } from './common/i18n/i18n.module';
import { MailerModule } from './common/mailer/mailer.module';
import { MongoModule } from './common/mongo/mongo.module';
import { HttpExceptionFilter } from './providers/filters/http-exception.filter';
import { ResponseInterceptor } from './providers/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';
import { ParameterValidationPipe } from './providers/pipes/parameter-validate.pipe';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Module({
  imports: [I18nModule, MongoModule, MailerModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    // Http 异常过滤器
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // Response 拦截器
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    // 参数验证管道
    { provide: APP_PIPE, useClass: ParameterValidationPipe },
    // RBAC 授权
    { provide: APP_GUARD, useClass: RolesGuard },
    AppService,
  ],
})
export class AppModule {}
