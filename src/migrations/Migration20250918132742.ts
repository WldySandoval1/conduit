import { Migration } from '@mikro-orm/migrations';

export class Migration20250918132742 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`article\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`title\` text not null, \`description\` text not null, \`body\` text not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`tag_list\` text not null, \`author_id\` integer not null, \`favorites_count\` integer not null, constraint \`article_author_id_foreign\` foreign key(\`author_id\`) references \`user\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`article_author_id_index\` on \`article\` (\`author_id\`);`);

    this.addSql(`create table \`comment\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`body\` text not null, \`article_id\` integer not null, \`author_id\` integer not null, constraint \`comment_article_id_foreign\` foreign key(\`article_id\`) references \`article\`(\`id\`) on update cascade, constraint \`comment_author_id_foreign\` foreign key(\`author_id\`) references \`user\`(\`id\`) on update cascade);`);
    this.addSql(`create index \`comment_article_id_index\` on \`comment\` (\`article_id\`);`);
    this.addSql(`create index \`comment_author_id_index\` on \`comment\` (\`author_id\`);`);

    this.addSql(`create table \`user_favorites\` (\`user_id\` integer not null, \`article_id\` integer not null, constraint \`user_favorites_user_id_foreign\` foreign key(\`user_id\`) references \`user\`(\`id\`) on delete cascade on update cascade, constraint \`user_favorites_article_id_foreign\` foreign key(\`article_id\`) references \`article\`(\`id\`) on delete cascade on update cascade, primary key (\`user_id\`, \`article_id\`));`);
    this.addSql(`create index \`user_favorites_user_id_index\` on \`user_favorites\` (\`user_id\`);`);
    this.addSql(`create index \`user_favorites_article_id_index\` on \`user_favorites\` (\`article_id\`);`);
  }

}
