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
  @observable avatar: string = DEFAULT_AVATAR;
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

  static async logout() {
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

export function patchAvatar(obj: { avatar: string }) {
  if (obj.avatar.trim()) {
    obj.avatar = obj.avatar.trim();
    if (!/^https?:\/\//.test(obj.avatar)) {
      obj.avatar = staticBaseUrl + obj.avatar;
    }
  } else {
    obj.avatar = DEFAULT_AVATAR;
  }
}

export const DEFAULT_AVATAR =
  'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMERDNjhFQThBRkUxMUU4Qjc1MUJENDk3MDI4N0E1MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMERDNjhFQjhBRkUxMUU4Qjc1MUJENDk3MDI4N0E1MCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQwREM2OEU4OEFGRTExRThCNzUxQkQ0OTcwMjg3QTUwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQwREM2OEU5OEFGRTExRThCNzUxQkQ0OTcwMjg3QTUwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJ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';
