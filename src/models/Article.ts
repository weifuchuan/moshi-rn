import { _IArticle } from './_db';
import { GET, Ret, POST_FORM, select } from '@/kit/req';
import { observable, runInAction } from 'mobx';
import { _IArticleComment } from './_db';
import Account from '@/models/Account';
import BitKit from '../kit/BitKit';
import { IAudio } from './Audio';
import { Page } from './Page';

export interface IArticle extends _IArticle {
  visitAt?: number;
  trialReading?: boolean;
  readed?: boolean;
  nickName?: string;
  avatar?: string;
  courseName?: string;
  liked?: boolean;
  likeCount?: number;
  audio?: {
    recorder: string;
    resource: string;
  };
}

export interface IArticleComment extends _IArticleComment {
  nickName: string;
  avatar: string;
  likeCount: number;
  liked?: boolean;
}

export default class Article implements IArticle {
  @observable id: number = 0;
  @observable courseId: number = 0;
  @observable title: string = '';
  @observable summary: string = '';
  @observable content: string = '';
  @observable publishAt?: number | undefined;
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable audioId: number = 0;
  @observable contentType: string = 'html';
  @observable coverImage?: string = '';
  @observable liked?: boolean;
  @observable likeCount?: number;

  @observable nickName?: string;
  @observable avatar?: string;
  @observable courseName?: string;
  @observable
  audio?: {
    recorder: string;
    resource: string;
  };

  // foreign
  @observable comments: ArticleComment[] = [];

  async fetchComments() {
    const comments = await select<IArticleComment>(
      '/select/teacher',
      `
        select ac.*, u.avatar, u.nickName 
        from article_comment_t ac, account_t u
        where ac.articleId = ? and ac.accountId = u.id 
      `,
      this.id
    );
    this.comments = observable(comments.map(ArticleComment.from));
  }

  async fetchAudio() {
    if (this.audio) return true;
    if (this.audioId) {
      const resp = await GET<{
        recorder: string;
        resource: string;
      }>('/audio', { id: this.audioId });
      const ret = resp.data;
      this.audio = ret;
      return true;
    } else {
      return false;
    }
  }

  async update() {
    const resp = await POST_FORM('/article/update', {
      id: this.id,
      status,
      audioId: this.audioId,
      content: this.content,
      title: this.title,
      summary: this.summary
    });
    if (resp.data.state === 'fail') {
      throw resp.data.msg;
    }
  }

  static from(i: IArticle) {
    const instance = new Article();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  /**
   * APIs
   */

  static async page(
    courseId: number,
    cending: 'desc' | 'asc',
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    const resp = await GET<Page<IArticle>>('/srv/v1/article/list', {
      courseId,
      cending,
      pageNumber,
      pageSize
    });
    return resp.data;
  }

  static async visit(id: number) {
    await GET('/srv/v1/statistics/visit', { id, type: 'article' });
  }

  static async fetch(id: number): Promise<Article> {
    const resp = await GET('/srv/v1/article', { id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      const article = Article.from(ret.article);
      const comments = ret.comments.map(ArticleComment.from);
      article.comments = observable(comments);
      return article;
    } else {
      throw ret.msg;
    }
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    INIT: 0,
    LOCK: 1,
    PUBLISH: 1 << 1,
    OPEN: 1 << 2,
    isInit(article: IArticle) {
      return article.status === 0;
    },
    isLock(article: IArticle) {
      return BitKit.at(article.status, 0) === 1;
    },
    isPublish(article: IArticle) {
      return BitKit.at(article.status, 1) === 1;
    },
    isOpen(article: IArticle) {
      return BitKit.at(article.status, 2) === 1;
    }
  });
}

export class ArticleComment implements IArticleComment {
  @observable id: number = 0;
  @observable articleId: number = 0;
  @observable accountId: number = 0;
  @observable content: string = '';
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable replyTo?: number | undefined;
  @observable nickName: string = '';
  @observable avatar: string = '';
  @observable accountStatus: number = 0;
  @observable likeCount: number = 0;
  @observable liked?: boolean;

  static from(i: IArticleComment) {
    const instance = new ArticleComment();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  /**
   * APIs
   */

  static async comment(articleId: number, content: string) {
    const resp = await POST_FORM('/srv/v1/article/comment', {
      id: articleId,
      content
    });
    const ret = resp.data;
    if (ret.state === 'ok')
      return ArticleComment.from({
        id: ret.id,
        articleId,
        accountId: store.me!.id,
        content,
        createAt: ret.createAt,
        nickName: store.me!.nickName,
        avatar: store.me!.avatar,
        likeCount: 0,
        liked: false,
        status: ArticleComment.STATUS.ORDINARY
      });
    else throw ret.msg;
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    ORDINARY: 0,
    TOP: 1
  });
}

if (__DEV__) {
  (window as any).Article = Article;
}
