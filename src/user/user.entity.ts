import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/sqlite';
import { IsEmail } from 'class-validator';
import { UserRepository } from './user.repository';
import { hashSync } from 'bcrypt';
import { Article } from '../article/article.entity';

@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  username: string;

  @Property({ hidden: true })
  @IsEmail()
  email: string;

  @Property()
  bio: string & Opt = '';

  @Property()
  image: string & Opt = '';

  @Property({ hidden: true })
  password: string;

  @ManyToMany({ hidden: true })
  favorites = new Collection<Article>(this);

  @ManyToMany({
    hidden: true,
    entity: () => User,
    inversedBy: (u) => u.followed,
    owner: true,
    pivotTable: 'user_to_follower',
  })
  followers = new Collection<User>(this);

  @ManyToMany(() => User, (u) => u.followers, { hidden: true })
  followed = new Collection<User>(this);

  @OneToMany(() => Article, (article) => article.author, { hidden: true })
  articles = new Collection<Article>(this);

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = hashSync(password, 10);
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO;
    o.image =
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
    o.following =
      user && user.followers.isInitialized()
        ? user.followers.contains(this)
        : false;

    return o;
  }
}

interface UserDTO extends EntityDTO<User> {
  following?: boolean;
}
