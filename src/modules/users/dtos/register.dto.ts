import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from 'src/enums/user-gender.enum';
import { IsAlphaDash } from 'src/providers/decorators/is-alpha-dash.decorator';
import { IsDateString } from 'src/providers/decorators/is-date-string.decorator';
import { IsEmail } from 'src/providers/decorators/is-email.decorator';
import { IsIn } from 'src/providers/decorators/is-in.decorator';
import { IsNotEmpty } from 'src/providers/decorators/is-not-empty.decorator';
import { IsOptional } from 'src/providers/decorators/is-optional.decorator';
import { MaxLength } from 'src/providers/decorators/max-length.decorator';
import { MinLength } from 'src/providers/decorators/min-length.decorator';
import { User } from '../user.model';

export class RegisterDto
  implements
    Pick<
      User,
      'email' | 'password' | 'nickname' | 'birthday' | 'gender' | 'avatar'
    >
{
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

  @MaxLength(16)
  @IsNotEmpty()
  @ApiProperty({ description: '昵称', default: 'Shugetsu' })
  nickname: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: '生日', default: new Date('1997/2/14 00:00:00') })
  birthday: Date;

  @IsIn([UserGender.NEUTRAL, UserGender.WOMAN, UserGender.MALE])
  @IsOptional()
  @ApiProperty({
    description: '性别',
    required: false,
    default: UserGender.NEUTRAL,
    enum: [
      {
        [UserGender.NEUTRAL]: '中性',
        [UserGender.WOMAN]: '女',
        [UserGender.MALE]: '男',
      },
    ],
  })
  gender?: UserGender;

  @IsNotEmpty()
  @ApiProperty({ description: '头像' })
  avatar: string;
}
