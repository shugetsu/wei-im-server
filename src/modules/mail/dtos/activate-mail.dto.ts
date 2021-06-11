import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'src/providers/decorators/is-email.decorator';
import { IsNotEmpty } from 'src/providers/decorators/is-not-empty.decorator';

export class ActivateMailDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
