export interface Page<Model = any> {
  totalRow: number;
  pageNumber: number;
  firstPage: boolean;
  lastPage: boolean;
  totalPage: number;
  pageSize: number;
  list: Model[];
}