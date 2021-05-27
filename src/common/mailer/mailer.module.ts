import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerConfig } from 'src/config/mailer.config';

export const MailerModule = Mailer.forRoot({
  preview: false,
  transport: {
    service: MailerConfig.service,
    secure: true,
    auth: {
      user: MailerConfig.auth.user,
      pass: MailerConfig.auth.pass,
    },
  },
  defaults: {
    from: MailerConfig.defaultSenderEmail,
  },
  template: {
    dir: process.cwd() + '/src/common/mailer/templates/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
