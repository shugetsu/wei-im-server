import { ApiProperty } from '@nestjs/swagger';
import { Device } from 'src/enums/device.enum';
import { IsAlphaDash } from 'src/providers/decorators/is-alpha-dash.decorator';
import { IsEmail } from 'src/providers/decorators/is-email.decorator';
import { IsIn } from 'src/providers/decorators/is-in.decorator';
import { IsNotEmpty } from 'src/providers/decorators/is-not-empty.decorator';
import { MaxLength } from 'src/providers/decorators/max-length.decorator';
import { MinLength } from 'src/providers/decorators/min-length.decorator';
import { User } from '../user.model';

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '邮箱', default: '1968304304@qq.com' })
  email: string;

  @IsAlphaDash()
  @MaxLength(16)
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ description: '密码', default: '123456' })
  password: string;

  @IsIn([Device.ANDROID, Device.IOS, Device.MAC, Device.WEB, Device.WINDOW])
  @IsNotEmpty()
  @ApiProperty({
    description: '设备',
    enum: Device,
  })
  device: Device;
}
