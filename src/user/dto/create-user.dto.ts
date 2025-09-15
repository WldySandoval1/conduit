import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  readonly username!: string;

  @ApiProperty({ example: 'user@email.com' })
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ example: 'contraseña' })
  @IsNotEmpty()
  readonly password!: string;
}
