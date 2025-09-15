import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { promises } from 'dns';
import { UserResponse, UserData } from './user.interface';
import { User } from './user.decorator';
import { LoginUserDto, UpdateUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';

class LoginApiBody {
  @ApiProperty()
  user: LoginUserDto;
}

class CreateApiBody {
  @ApiProperty()
  user: CreateUserDto;
}

class UpdateApiBody {
  @ApiProperty()
  user: UpdateUserDto;
}

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get('user')
  async findByEmail(@User('email') email: string): Promise<UserResponse> {
    return this.service.findByEmail(email);
  }
  @Put('user')
  @ApiBody({ type: UpdateApiBody })
  async update(
    @User('id') userId: number,
    @Body('user') UserData: UpdateUserDto,
  ) {
    return this.service.update(userId, UserData);
  }

  @Post('user')
  @ApiBody({ type: CreateApiBody })
  @UsePipes(new ValidationPipe())
  async create(@Body('user') UserData: CreateUserDto) {
    return this.service.create(UserData);
  }

  @Delete('user/:email')
  @ApiParam({ name: 'email', example: 'user@gmail.com' })
  async delete(@Param() email: string) {
    this.service.delete(email);
  }

  @UsePipes(new ValidationPipe())
  @Post('user/login')
  @ApiBody({ type: LoginApiBody })
  async login(@Body('user') loginDto: LoginUserDto): Promise<UserResponse> {
    const foundUser = await this.service.findOne(loginDto);

    if (!foundUser) {
      throw new HttpException(
        {
          message: 'User not found',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.service.generateJWT(foundUser);

    const { email, username, bio, image } = foundUser;
    const user = { email, username, bio, image, token };

    return { user };
  }
}
