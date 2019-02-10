import { _IAudio } from "../_db";
import { observable, runInAction } from "mobx";
import { GET, staticBaseUrl } from "@/kit/req";

export interface IAudio extends _IAudio {}

export default class Audio implements IAudio {
  @observable id: number = 0;
  @observable resource: string = "";
  @observable recorder: string = "";
  @observable accountId: number = 0;
  @observable status: number = 0;
  @observable name: string = "";
  @observable uploadAt: number = 0;

  static from(i: IAudio) {
    if (__DEV__) {
      i.resource = staticBaseUrl + i.resource;
    }
    const instance = new Audio();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  static async myUploaded(): Promise<Audio[]> {
    const resp = await GET<IAudio[]>("/audio/myUploaded");
    return observable(resp.data.map(Audio.from));
  }
}
