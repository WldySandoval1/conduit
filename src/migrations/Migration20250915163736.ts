import { Migration } from '@mikro-orm/migrations';

export class Migration20250915163736 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` integer not null primary key autoincrement, \`username\` text not null, \`email\` text not null, \`bio\` text not null, \`image\` text not null, \`password\` text not null);`);

    this.addSql(`create table \`user_to_follower\` (\`user_1_id\` integer not null, \`user_2_id\` integer not null, constraint \`user_to_follower_user_1_id_foreign\` foreign key(\`user_1_id\`) references \`user\`(\`id\`) on delete cascade on update cascade, constraint \`user_to_follower_user_2_id_foreign\` foreign key(\`user_2_id\`) references \`user\`(\`id\`) on delete cascade on update cascade, primary key (\`user_1_id\`, \`user_2_id\`));`);
    this.addSql(`create index \`user_to_follower_user_1_id_index\` on \`user_to_follower\` (\`user_1_id\`);`);
    this.addSql(`create index \`user_to_follower_user_2_id_index\` on \`user_to_follower\` (\`user_2_id\`);`);
  }

}
