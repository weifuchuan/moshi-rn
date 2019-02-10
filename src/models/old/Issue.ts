import { _IIssue, _IIssueComment } from "../_db";
import { GET, select } from "../../kit/req";
import { POST_FORM } from "@/kit/req";
import { observable, runInAction } from "mobx";
import Account from "@/models/Account";

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
  @observable title: string = "";
  @observable openAt: number = 0;
  @observable closerId?: number | undefined;
  @observable closeAt?: number | undefined;
  @observable status: number = 0;
  @observable nickName: string = "";
  @observable avatar: string = "";
  @observable commentCount: number = 0;

  // foreign
  @observable comments: IssueComment[] = [];

  private pageNumberToComments: Map<number, IssueComment[]> = new Map();
  async getPage(pageNumber: number): Promise<IssueComment[]> {
    let comments: IssueComment[] = [];
    if (this.pageNumberToComments.has(pageNumber)) {
      comments = this.pageNumberToComments.get(pageNumber)!;
    } else {
      comments = await IssueComment.page(this.id, pageNumber, 10);
      this.pageNumberToComments.set(pageNumber, observable(comments));
    }
    this.comments = comments;
    return comments;
  }

  private totalCommentCount = 0;
  async getTotalCommentCount() {
    if (this.totalCommentCount > 0) return this.totalCommentCount;
    const [{ count }] = await select<{ count: number }>(
      "/select",
      "select count(*) count from issue_comment_l where issueId = ?",
      this.id
    );
    this.totalCommentCount = count;
    return count;
  }

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

  static async fetch(courseId: number): Promise<Issue[]> {
    const resp = await GET<IIssue[]>("/issue/fetch", { courseId });
    return resp.data.map(Issue.from);
  }

  static async fetchIssue(id: number) {
    const ret = await select<IIssue>(
      "/select",
      `
        SELECT i.*, a.nickName, a.avatar
        FROM issue_l i, account_l a 
        WHERE i.id = ? && i.accountId = a.id
      `,
      id
    );
    if (ret.length > 0) {
      const issue = Issue.from(ret[0]);
      await Promise.all([issue.getPage(1), issue.getTotalCommentCount()]);
      return issue; 
    } else throw "issue not exists";
  }

  async comment(content: string, me: Account): Promise<void> {
    const resp = await POST_FORM("/issue/comment", {
      issueId: this.id,
      content
    });
    const ret = resp.data;
    if (ret.state === "ok") {
      this.comments.push(
        IssueComment.from({
          id: ret.id,
          createAt: ret.createAt,
          content,
          issueId: this.id,
          accountId: me.id,
          status: 0,
          nickName: me.nickName,
          avatar: me.avatar
        })
      );
      return;
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
  @observable content: string = "";
  @observable status: number = 0;
  @observable nickName: string = "";
  @observable avatar: string = "";

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
      "/select",
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

export class IssueAPI {
  static async fetch(courseId: number): Promise<IIssue[]> {
    const resp = await GET<IIssue[]>("/issue/fetch", { courseId });
    return resp.data;
  }

  static async fetchIssue(id: number) {
    const ret = await select<IIssue>(
      "/select",
      `
        SELECT i.*, a.nickName, a.avatar
        FROM issue_l i, account_l a 
        WHERE i.id = ? && i.accountId = a.id
      `,
      id
    );
    if (ret.length > 0) return ret[0];
    else throw "issue not exists";
  }

  static async page(issueId: number, pageNumber: number, pageSize: number) {
    const offset = pageSize * (pageNumber - 1);
    const ret = await select<IIssueComment>(
      "/select",
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
    return ret;
  }

  static async comment(
    issueId: number,
    content: string
  ): Promise<{ id: number; createAt: number }> {
    const resp = await POST_FORM("/issue/comment", { issueId, content });
    const ret = resp.data;
    if (ret.state === "ok") {
      return {
        id: ret.id,
        createAt: ret.createAt
      };
    } else {
      throw ret.msg;
    }
  }
}
