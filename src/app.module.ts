import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { MikroORM } from '@mikro-orm/sqlite';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule, ArticleModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit() {
    await this.orm.getMigrator().up();
  }
}
