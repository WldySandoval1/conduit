import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Nombre articulo' })
  @IsNotEmpty()
  readonly title!: string;

  @ApiProperty({ example: 'Descripción articulo' })
  @IsNotEmpty()
  readonly description!: string;

  @ApiProperty({ example: 'Cuerpo del articulo' })
  @IsNotEmpty()
  readonly body!: string;

  @ApiProperty({ example: ['tag1', 'tag2'] })
  @IsNotEmpty()
  readonly tagList!: string[];
}
