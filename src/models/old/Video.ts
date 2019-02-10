import { _IVideo } from "../_db";
import { observable, runInAction } from "mobx";
import { GET, staticBaseUrl } from "@/kit/req";

export interface IVideo extends _IVideo {}

export default class Video implements IVideo {
  @observable id: number = 0;
  @observable resource: string = "";
  @observable recorder: string = "";
  @observable accountId: number = 0;
  @observable status: number = 0;
  @observable name: string = "";
  @observable uploadAt:number=0; 
  
  static from(i: IVideo) {
    if (__DEV__) {
      i.resource = staticBaseUrl + i.resource;
    }
    const instance = new Video();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  static async myUploaded(): Promise<Video[]> {
    const resp = await GET<IVideo[]>("/video/myUploaded");
    return observable(resp.data.map(Video.from));
  }
}
