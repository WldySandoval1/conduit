import { EntityRepository } from '@mikro-orm/sqlite';
import { Article } from './article.entity';

export class ArticleRepository extends EntityRepository<Article> {}
