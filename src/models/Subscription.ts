import { _ISubscription } from './_db';
import { observable, runInAction } from 'mobx';
import { POST_FORM, GET } from '@/kit/req';

export interface ISubscription extends _ISubscription {}

export default class Subscription implements ISubscription {
  @observable id: string = '';
  @observable accountId: number = 0;
  @observable refId: number = 0;
  @observable subscribeType: string = '';
  @observable createAt: number = 0;
  @observable cost: number = 0;
  @observable status: number = 0;
  @observable payWay: number = 0;

  static async subscribe(
    payWay: number,
    refId: number,
    type: 'course' = 'course',
    coupons: string[] = []
  ) {
    const resp = await POST_FORM('/srv/v1/subscribe', {
      payWay,
      refId,
      type,
      coupons
    });
    const ret = resp.data;
    if (ret.state === 'ok') {
      return {
        subscription: Subscription.from(ret.subscription),
        timeout: ret.timeout as any
      };
    } else {
      throw ret.msg;
    }
  }

  static async cancel(id: string) {
    await GET('/srv/v1/subscribe/cancel', { id });
  }

  static async fail(id: string) {
    await GET('/srv/v1/subscribe/fail', { id });
  }

  static async delete(id: string) {
    await GET('/srv/v1/subscribe/delete', { id });
  }

  static async confirm(subscription: ISubscription) {
    const resp = await POST_FORM<any>('/srv/v1/subscribe/confirm', {
      id: subscription.id
    });
    const ret = resp.data;
    return ret;
  }

  static from(i: ISubscription) {
    const instance = new Subscription();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  static readonly STATUS_INIT = 0; // 未支付
  static readonly STATUS_SUCCESS = 1; // 支付成功
  static readonly STATUS_FAIL = 2; // 支付失败
  static readonly STATUS_CANCEL = 3; // 取消支付

  static readonly SUB_TYPE_COURSE = 'course'; // 课程

  static readonly PAY_WAY_QR_TEST = 0; // 二维码支付（测试）
  static readonly PAY_WAY_WX = 1; // 微信支付
  static readonly PAY_WAY_ALIPAY = 2; // 支付宝
}
