import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EntityManager, wrap } from '@mikro-orm/sqlite';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { compare, hash } from 'bcrypt';
import { UserResponse } from './user.interface';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
import { SECRET } from 'src/config';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  async findOne(credentials: LoginUserDto): Promise<User | null> {
    const foundUser = await this.repository.findOne({
      email: credentials.email,
    });

    if (!foundUser) {
      return null;
    }

    const isPasswordMatching = await compare(
      credentials.password,
      foundUser.password,
    );

    return isPasswordMatching ? foundUser : null;
  }

  async findByEmail(email: string): Promise<UserResponse> {
    const user = await this.repository.findOneOrFail({ email });
    return this.buildUserResponse(user);
  }

  async findById(id: number): Promise<UserResponse> {
    const user = await this.repository.findOne(id);

    if (!user) {
      const errors = { User: 'not found' };
      throw new HttpException({ errors }, 401);
    }

    return this.buildUserResponse(user);
  }

  async create({
    username,
    email,
    password,
  }: CreateUserDto): Promise<UserResponse> {
    const exists = await this.repository.count({
      $or: [{ username }, { email }],
    });

    if (exists > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'Username and email must be unique' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User(username, email, password);
    const errors = await validate(user);

    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { username: 'UserInput is not valid' },
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.em.persistAndFlush(user);
      return this.buildUserResponse(user);
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOneOrFail(id);

    wrap(user).assign(dto);

    await this.em.flush();

    return this.buildUserResponse(user);
  }

  async delete(email: string) {
    return this.repository.nativeDelete({ email });
  }

  private buildUserResponse(user: User): UserResponse {
    return {
      user: {
        bio: user.bio,
        email: user.email,
        image: user.image,
        token: this.generateJWT(user),
        username: user.username,
      },
    };
  }

  generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: user.email,
        exp: exp.getTime() / 1000,
        id: user.id,
        username: user.username,
      },
      SECRET,
    );
  }
}
