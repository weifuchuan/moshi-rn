import { _IAccount } from './_db';
import { GET, Ret, POST_FORM, staticBaseUrl } from '../kit/req';
import BitKit from '@/kit/BitKit';
import { observable, runInAction } from 'mobx';

export interface IAccount extends _IAccount {}

export default class Account implements IAccount {
  @observable id: number = 0;
  @observable nickName: string = '';
  @observable password: string = '';
  @observable email: string = '';
  @observable phone?: string | undefined;
  @observable avatar: string = '';
  @observable realName?: string | undefined;
  @observable identityNumber?: string | undefined;
  @observable age?: number | undefined;
  @observable company?: string | undefined;
  @observable position?: string | undefined;
  @observable personalProfile?: string | undefined;
  @observable sex?: string | undefined;
  @observable birthday?: number | undefined;
  @observable education?: string | undefined;
  @observable profession?: string | undefined;
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable realPictrue?: string;

  static from(i: IAccount) {
    const instance = new Account();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  /**
   * APIs
   */
  static async probeLoggedAccount(): Promise<Account> {
    const resp = await GET<Ret & { account: IAccount }>('/login/probe');
    if (resp.data.state === 'ok') {
      // resp.data.account.avatar = `${staticBaseUrl}${resp.data.account.avatar}`;
      return Account.from(resp.data.account);
    } else throw resp.data.msg;
  }

  static async login(
    email: string,
    password: string,
    captcha: string
  ): Promise<Account> {
    const resp = await POST_FORM<Ret & { account: IAccount }>('/login', {
      email,
      password,
      captcha
    });
    if (resp.data.state === 'ok') return Account.from(resp.data.account);
    else throw resp.data.msg;
  }

  static async reg(
    email: string,
    nickName: string,
    password: string,
    captcha: string
  ): Promise<Account> {
    const resp = await POST_FORM<Ret & { account: IAccount }>('/reg', {
      email,
      nickName,
      password,
      captcha
    });
    if (resp.data.state === 'ok') return Account.from(resp.data.account);
    else throw resp.data.msg;
  }

  static async activate(authcode: string) {
    const resp = await POST_FORM<Ret>('/reg/activate', {
      authcode
    });
    return resp.data;
  }

  static async reSendActivateEmail() {
    const resp = await GET<Ret>('/reg/reSendActivateEmail');
    return resp.data;
  }

  static async logout(){    
    try {
      await GET('/logout');
    } catch (e) {}
  }

  /**
   * Constants
   */
  static readonly STATUS = Object.freeze({
    REG: 0,
    LOCK: 1 << 0,
    LEARNER: 1 << 1,
    TEACHER: 1 << 2,
    MANAGER: 1 << 3,
    isReg(account: IAccount) {
      return account.status === this.REG;
    },
    isLock(account: IAccount) {
      return BitKit.at(account.status, 0) === 1;
    },
    isLearner(account: IAccount) {
      return BitKit.at(account.status, 1) === 1;
    },
    isTeacher(account: IAccount) {
      return BitKit.at(account.status, 2) === 1;
    },
    isManager(account: IAccount) {
      return BitKit.at(account.status, 3) === 1;
    }
  });
}

export const FAKE_ACCOUNT = new Account();
