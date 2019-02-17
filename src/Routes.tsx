import { Actions } from 'react-native-router-flux';
import { ICourse } from '@/models/Course';
import { ISubscription } from './models/Subscription';
import { IArticle, IArticleComment, ArticleComment } from '@/models/Article';

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
  }
};

(Routes as any).__proto__ = Actions;

export default Routes as (typeof Routes) & (typeof Actions);
