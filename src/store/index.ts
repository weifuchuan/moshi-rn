import React, {useContext} from 'react';
import {autorun, observable} from 'mobx';
import Account from '@/models/Account';
import { GET, Ret } from '@/kit/req';
import { ICourse } from '@/models/Course';
import { retryDo } from '@/kit';
import { Toast } from '@ant-design/react-native';
import {initEasyrecConfig} from "@/kit/easyrec";

export class Store {
  @observable me: Account | null = null;

  @observable exploreData: any = {};

  constructor() {
    (async () => {
      try {
        const data = await storage.load({
          key: 'explore'
        });
        // console.warn('exploreData',data)
        if (!this.exploreData) this.exploreData = observable(data);
      } catch (err) {}
    })();
  }

  // TODO: fetch explored data by parting
  // async explore() {
  //   if (__DEV__) {
  //     // GET('/srv/v1/course/clear');
  //   }
  //   const resp = await retryDo(
  //     async () => await GET('/srv/v1/explore', null, { timeout: 10000 }),
  //     3
  //   );
  //   const ret = resp.data;
  //   this.exploreData = observable(ret);
  //   await storage.save({ key: 'explore', data: ret });
  //   // console.warn('save exploreData',ret)
  // }

  async exploreNewsList() {
    const resp = await retryDo(
      async () =>
        await GET('/srv/v1/explore/newsList', null, { timeout: 10000 }),
      3
    );
    const ret = resp.data;
    this.exploreData.newsList = ret;
  }

  async exploreSubscribedCourseList() {
    const resp = await retryDo(
      async () =>
        await GET('/srv/v1/explore/subscribedCourseList', null, {
          timeout: 10000
        }),
      3
    );
    const ret = resp.data;
    this.exploreData.subscribedCourseList = ret;
  }

  async exploreHotCourseList() {
    const resp = await retryDo(
      async () =>
        await GET('/srv/v1/explore/hotCourseList', null, { timeout: 10000 }),
      3
    );
    const ret = resp.data;
    this.exploreData.hotColumnList = ret.hotColumnList;
    this.exploreData.hotVideoList = ret.hotVideoList;
  }
}

const store = new Store();

export function useStore(){
  return useContext(StoreContext)
}

autorun(()=>{
  if (store.me){
    initEasyrecConfig()
  }
})

Account.probeLoggedAccount()
  .then((account) => {
    store.me = account;
    // return store.explore();
  })
  .catch((err) => {
    console.info('unlogin');
    // return store.explore();
  })
  .catch((err) => {
    Toast.fail('网络错误！');
  });
// .then(() => {
//   bus.emit('fullLoading', false);
// });

export const StoreContext = React.createContext(store);

export default store;

(global as any).store = store;
