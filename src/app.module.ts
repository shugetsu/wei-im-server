import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nModule } from './common/i18n/i18n.module';
import { MailerModule } from './common/mailer/mailer.module';
import { MongoModule } from './common/mongo/mongo.module';
import { HttpExceptionFilter } from './providers/filters/http-exception.filter';
import { ResponseInterceptor } from './providers/interceptors/response.interceptor';

@Module({
  imports: [I18nModule, MongoModule, MailerModule],
  controllers: [AppController],
  providers: [
    // Http 异常过滤器
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // Response 拦截器
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    AppService,
  ],
})
export class AppModule {}
