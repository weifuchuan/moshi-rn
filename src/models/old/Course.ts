import BitKit from '@/kit/BitKit';
import { GET, POST_FORM, Ret } from '@/kit/req';
import { observable, runInAction } from 'mobx';

import { _ICourse } from '../_db';
import { IArticle } from './Article';
import Issue, { IIssue } from './Issue';
import Article from './Article';

// export type ICourse = _ICourse;

export interface ICourse extends _ICourse {
  nickName?: string;
  avatar?: string;
  realPicture?: string;
}

export default class Course implements ICourse {
  @observable id: number = 0;
  @observable accountId: number = 0;
  @observable name: string = '';
  @observable introduce: string = '';
  @observable introduceImage?: string | undefined;
  @observable note?: string | undefined;
  @observable createAt: number = 0;
  @observable publishAt?: number | undefined;
  @observable buyerCount: number = 0;
  @observable courseType: number = 0;
  @observable price?: number | undefined;
  @observable discountedPrice?: number | undefined;
  @observable offerTo?: number | undefined;
  @observable status: number = 0;

  @observable nickName?: string;
  @observable avatar?: string;
  @observable realPicture?: string;

  
 
  static from(i: ICourse) {
    const instance = new Course();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  static readonly TYPE = Object.freeze({
    COLUMN: 1,
    VIDEO: 2
  });
}
