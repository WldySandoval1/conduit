import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsNotEmpty()
  readonly email!: string;
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  readonly password!: string;
}
