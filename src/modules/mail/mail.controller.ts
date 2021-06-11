import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { ApiHeaderLang } from 'src/providers/decorators/api-header-lang.decorator';
import { ApiHeaderToken } from 'src/providers/decorators/api-header-token.decorator';
import { ActivateMailDto } from './dtos/activate-mail.dto';
import { MailService } from './mail.service';

@Controller('Mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * 发送激活邮件
   */
  @Post('sendActivateMail')
  @ApiHeaderToken()
  @ApiHeaderLang()
  @ApiOperation({ summary: '发送激活邮件' })
  public async sendActivateMail(
    @I18nLang() lang: string,
    @Body() { email }: ActivateMailDto,
  ) {
    return await this.mailService.sendActivateMail(email, lang);
  }
}
