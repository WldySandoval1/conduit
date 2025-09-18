import { ArticleDTO } from './article.entity';

export interface CommentResponse {
  body: string;
}

export interface CommentsResponse {
  comments: CommentResponse[];
}

export interface ArticleResponse {
  article: ArticleDTO;
}

export interface ArticlesResponse {
  articles: ArticleDTO[];
  articlesCount: number;
}
