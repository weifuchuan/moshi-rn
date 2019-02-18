import { _IIssue, _IIssueComment } from './_db';
import { GET, select } from '@/kit/req';
import { POST_FORM } from '@/kit/req';
import { observable, runInAction } from 'mobx';
import Account from '@/models/Account';
import { Page } from '@/models/Page';
import { number } from 'prop-types';

export type IIssue = _IIssue & {
  nickName: string;
  avatar: string;
  commentCount: number;
};

export type IIssueComment = _IIssueComment & {
  nickName: string;
  avatar: string;
};

export default class Issue implements IIssue {
  @observable id: number = 0;
  @observable courseId: number = 0;
  @observable accountId: number = 0;
  @observable title: string = '';
  @observable openAt: number = 0;
  @observable closerId?: number | undefined;
  @observable closeAt?: number | undefined;
  @observable status: number = 0;
  @observable nickName: string = '';
  @observable avatar: string = '';
  @observable commentCount: number = 0;

  // foreign
  @observable comments: IssueComment[] = [];

  static from(i: IIssue) {
    const instance = new Issue();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  /**
   * APIs
   */

  static async fetchIssue(id: number) {
    const resp = await GET('/srv/v1/issue', { id });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return ret as any as {
        issue: IIssue;
        comments: IIssueComment[];
      };
    } else {
      throw ret.msg;
    }
  }

  static async page(
    courseId: number,
    filter: 'open' | 'close' | 'your',
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    const resp = await POST_FORM('/srv/v1/issue/list', {
      courseId,
      filter,
      pageNumber,
      pageSize
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      const page: Page<IIssue> = ret.page;
      return { ...page, list: observable(page.list.map(Issue.from)) };
    } else {
      throw ret.msg;
    }
  }

  static async create(courseId: number, title: string, content: string) {
    const resp = await POST_FORM('/srv/v1/issue/create', {
      courseId,
      title,
      content
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      const { id, openAt } = ret;
      return { id, openAt } as { id: number; openAt: number };
    } else {
      throw ret.msg;
    }
  }

  static async comment(id: number, content: string) {
    const resp = await POST_FORM('/srv/v1/issue/comment', {
      id,
      content
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return (ret as any) as {
        id: number;
        createAt: number;
      };
    } else {
      throw ret.msg;
    }
  }

  /**
   * Contants
   */

  static readonly STATUS = {
    OPEN: 0,
    CLOSE: 1
  };
}

export class IssueComment implements IIssueComment {
  @observable id: number = 0;
  @observable issueId: number = 0;
  @observable accountId: number = 0;
  @observable createAt: number = 0;
  @observable content: string = '';
  @observable status: number = 0;
  @observable nickName: string = '';
  @observable avatar: string = '';

  static from(i: IIssueComment) {
    const instance = new IssueComment();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  static async page(
    issueId: number,
    pageNumber: number,
    pageSize: number
  ): Promise<IssueComment[]> {
    const offset = pageSize * (pageNumber - 1);
    const ret = await select<IIssueComment>(
      '/select',
      `
        select ic.*, a.nickName, a.avatar
        from issue_comment_l ic, issue_l i, account_l a
        where i.id = ? and i.id = ic.issueId and ic.accountId = a.id 
        limit ?, ?
      `,
      issueId,
      offset,
      pageSize
    );
    return ret.map(IssueComment.from);
  }
}

export const IssueStatus = {
  STATUS_OPEN: 0,
  STATUS_CLOSE: 1
};
