import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderLang } from 'src/providers/decorators/api-header-lang.decorator';
import { ParameterValidationPipe } from 'src/providers/pipes/parameter-validate.pipe';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('用户')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 注册
   * @param data
   */
  @Post('register')
  @UsePipes(ParameterValidationPipe)
  @ApiHeaderLang()
  @ApiOperation({ summary: '注册' })
  async register(@Body() data: RegisterDto) {
    return await this.usersService.register(data);
  }

  /**
   * 登录
   * @param data
   */
  @Post('login')
  @UsePipes(ParameterValidationPipe)
  @ApiHeaderLang()
  @ApiOperation({ summary: '登录' })
  async login(@Body() data: LoginDto) {
    return await this.usersService.login(data);
  }
}
