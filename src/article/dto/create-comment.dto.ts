import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  body: string;
}
