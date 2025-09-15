import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example:
      'Velit est dolor laboris cupidatat mollit aliqua aliqua et consequat sint et culpa.',
  })
  readonly bio!: string;

  @ApiProperty({ example: 'user@mail.com' })
  readonly email!: string;

  @ApiProperty({
    example: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  })
  readonly image!: string;

  @ApiProperty({ example: 'user' })
  readonly username!: string;
}
