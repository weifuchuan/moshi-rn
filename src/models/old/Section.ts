import { _ISection, _IParagraph } from "../_db";
import { observable, runInAction } from "mobx";

export interface IParagraph extends _IParagraph {}

export interface ISection extends _ISection {}

export class Paragraph implements IParagraph {
  @observable id: number = 0;
  @observable sectionId: number = 0;
  @observable accountId: number = 0;
  @observable vedioId: number = 0;
  @observable content: string = "";
  @observable createAt: number = 0;
  @observable status: number = 0;

  static from(i: IParagraph) {
    const instance = new Paragraph();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }
}

export default class Section implements ISection {
  @observable id: number = 0;
  @observable courseId: number = 0;
  @observable accountId: number = 0;
  @observable title: string = "";
  @observable createAt: number = 0;
  @observable status: number = 0;

  // foreign
  @observable paragraphs: Paragraph[] = [];

  static from(i: ISection) {
    const instance = new Section();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }
}
