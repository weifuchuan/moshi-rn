import { _IApplication } from "../_db";
import { POST_FORM, Ret } from "../../kit/req";
import { observable, runInAction } from "mobx";

type IApplication = _IApplication;
export { IApplication };

export default class Application implements IApplication {
  @observable id: number = 0;
  @observable accountId: number = 0;
  @observable category: number = 0;
  @observable title: string = "";
  @observable content: string = "";
  @observable createAt: number = 0;
  @observable status: number = 0;
  @observable reply?: string | undefined;
  @observable refId: number = 0;
  @observable contentType: string = "html";

  static from(i: IApplication) {
    const instance = new Application();
    runInAction(() => {
      Object.assign(instance, i);
    });
    return instance;
  }

  /**
   * APIs
   */

  static async my(category: number): Promise<Application[]> {
    const resp = await POST_FORM<IApplication[]>("/apply/my", { category });
    return resp.data.map(Application.from);
  }

  static async commit(
    id: number,
    title: string,
    content: string,
    category: number
  ): Promise<Ret> {
    const resp = await POST_FORM("/apply/commit", {
      id,
      title,
      content,
      category
    });
    return resp.data;
  }

  static async cancel(id: number) {
    const resp = await POST_FORM("/apply/cancel", { id });
    return resp.data;
  }

  /**
   * Constants
   */

  static readonly STATUS = Object.freeze({
    COMMIT: 0,
    PASSED: 1,
    FAIL: 2
  });

  static readonly CATEGORY = Object.freeze({
    TEACHER: 0,
    COURSE_COLUMN: 1,
    COURSE_VIDEO: 2
  });
}  