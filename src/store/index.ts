import React from 'react';
import { observable } from 'mobx';
import Account from '@/models/Account';
import { GET, Ret } from '@/kit/req';
import { ICourse } from '@/models/Course';
import { retryDo } from '@/kit';
import { Toast } from '@ant-design/react-native';

export class Store {
  @observable me: Account | null = null;

  @observable exploreData: any | null = null;
  @observable explored = false;

  constructor() {
    (async () => {
      try {
        const data = await storage.load({
          key: 'explore'
        });
        if (!this.exploreData) this.exploreData = data;
      } catch (err) {}
    })();
  }

  async explore() {
    if(__DEV__){
      GET("/srv/v1/course/clear")
    }
    const resp = await retryDo(
      async () =>
        await GET<
          Ret & {
            hotColumnList: ICourse[];
            hotVideoList: ICourse[];
          }
        >('/srv/v1/explore', null, { timeout: 10000 }),
      3
    );
    const ret = resp.data;
    this.exploreData = ret;
    this.explored = true;
    await storage.save({ key: 'explore', data: ret });
  }
}

const store = new Store();

Account.probeLoggedAccount()
  .then((account) => {
    store.me = account;
    return store.explore();
  })
  .catch((err) => {
    console.info('unlogin');
    return store.explore();
  })
  .catch((err) => {
    Toast.fail('网络错误！');
  });

export const StoreContext = React.createContext(store);

export default store;

(global as any).store = store;
