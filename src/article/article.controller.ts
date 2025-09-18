import { ValidationPipe } from './../pipes/validation.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { User } from 'src/user/user.decorator';
import { CreateArticleDto, CreateCommentDto } from './dto';
import {
  ArticleResponse,
  ArticlesResponse,
  CommentsResponse,
} from './article.interface';
import { UpdateArticleDto } from './dto/update-article.dto';

class CreateArticleApiBody {
  @ApiProperty()
  article: CreateArticleDto;
}
class UpdateArticleBody {
  @ApiProperty()
  article: UpdateArticleDto;
}

class CreateCommentApiBody {
  @ApiProperty()
  comment: CreateCommentDto;
}

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Get()
  async findAll(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticlesResponse> {
    return this.service.findAll(userId, query);
  }

  @Get('feed')
  async findFeed(
    @User('id') userId: number,
    @Query() query: any,
  ): Promise<ArticlesResponse> {
    return this.service.findFeed(userId, query);
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  async findOne(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    return this.service.findOne(userId, { slug });
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateArticleApiBody })
  async create(
    @User('id') userId: number,
    @Body('article') articleData: CreateArticleDto,
  ): Promise<ArticleResponse> {
    return this.service.create(userId, articleData);
  }

  @Put(':slug')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  @ApiBody({ type: UpdateArticleBody })
  async update(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body('article') articleData: Partial<CreateArticleDto>,
  ): Promise<ArticleResponse> {
    return this.service.update(userId, slug, articleData);
  }

  @Delete(':slug')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  async delete(@Param('slug') slug: string) {
    return this.service.delete(slug);
  }

  @Post(':slug/comments')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  @ApiBody({ type: CreateCommentApiBody })
  async addComment(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Body('comment') commentData: CreateCommentDto,
  ) {
    return this.service.addComment(userId, slug, commentData);
  }

  @Get(':slug/comments')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  async findComments(@Param('slug') slug: string): Promise<CommentsResponse> {
    return this.service.findComments(slug);
  }

  @Delete(':slug/comments/:id')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  @ApiParam({ name: 'id', example: 42 })
  async deleteComment(
    @User('id') userId: number,
    @Param('slug') slug: string,
    @Param('id') id: number,
  ): Promise<ArticleResponse> {
    return this.service.deleteComment(userId, slug, id);
  }

  @Post(':slug/favorite')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  async favorite(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    return this.service.favorite(userId, slug);
  }

  @Delete(':slug/favorite')
  @ApiParam({ name: 'slug', example: 'como-aprender-nestjs-abc123' })
  async unFavorite(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    return this.service.unFavorite(userId, slug);
  }
}
