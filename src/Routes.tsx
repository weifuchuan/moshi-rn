import { Actions } from 'react-native-router-flux';
import { ICourse } from '@/models/Course';
import { ISubscription } from './models/Subscription';
import { IArticle, IArticleComment, ArticleComment } from '@/models/Article';
import Issue, { IIssue, IIssueComment } from './models/Issue';

const Routes = {
  login() {
    Actions.push('login');
  },
  reg() {
    Actions.push('reg');
  },
  explore() {
    Actions.push('explore');
  },
  classroom() {
    Actions.push('classroom');
  },
  learn() {
    Actions.push('learn');
  },
  settings() {
    Actions.push('settings');
  },
  article(article: IArticle, list?: IArticle[]) {
    Actions.push('article', { article, list });
  },
  articleComment(
    article: IArticle,
    onCommentSuccess: (comment: ArticleComment) => void
  ) {
    Actions.push('articleComment', { article, onCommentSuccess });
  },
  course(course: ICourse) {
    Actions.push('course', { course: course });
  },
  courseIntro(course: ICourse) {
    Actions.push('courseIntro', { course: course });
  },
  courseList(type: 'column' | 'video') {
    Actions.push('courseList', { type });
  },
  subscribe(course: ICourse) {
    Actions.push('subscribe', { course: course });
  },
  pay(subscription: ISubscription, timeout: number) {
    Actions.push('pay', { subscription, timeout });
  },
  issue(issue: IIssue) {
    Actions.push('issue', { issue });
  },
  createIssue(course: ICourse, onSuccess: (issue: Issue) => void) {
    Actions.push('createIssue', { course, onSuccess });
  },
  issueComment(
    issue: IIssue,
    onCommentSuccess: (comment: IIssueComment) => void
  ) {
    Actions.push('issueComment', { issue, onCommentSuccess });
  }
};

// @ts-ignore
Routes.__proto__ = Actions;

export default Routes as (typeof Routes) & (typeof Actions);