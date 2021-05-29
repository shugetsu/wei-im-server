import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/enums/user-role.enum';
import { ApiHeaderLang } from 'src/providers/decorators/api-header-lang.decorator';
import { ApiHeaderToken } from 'src/providers/decorators/api-header-token.decorator';
import { Roles } from 'src/providers/decorators/roles-decorator';
import { ParameterValidationPipe } from 'src/providers/pipes/parameter-validate.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

  /**
   * 根据id获取用户
   * @param id
   */
  @UseGuards(JwtAuthGuard)
  @Get('getUserById')
  @UsePipes(ParameterValidationPipe)
  @ApiHeaderLang()
  @ApiHeaderToken()
  @ApiOperation({ summary: '根据id获取用户' })
  async getUserById(@Query('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  /**
   * 根据邮箱获取用户
   * @param email
   */
  // @UseGuards(JwtAuthGuard)
  @Roles(UserRole.NORMAL_USER)
  @Get('getUserByEmail')
  @UsePipes(ParameterValidationPipe)
  @ApiHeaderLang()
  @ApiHeaderToken()
  @ApiOperation({ summary: '根据邮箱获取用户' })
  async getUserByEmail(@Query('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }
}
