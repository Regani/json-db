import { SchemeInfo, DBInfo } from './types';

export interface DBInterface {
  dbpath: string;
  dbFilePath: string;
  dbInfo: DBInfo;
}

interface getDataFunction {
  (): object[];
}

interface getTableFunction {
  (tableName: string): TableInterface | undefined;
}

interface insertItemFunction {
  (data: object): object[] | void;
}

interface updateItemFunction {
  (data: object): object[] | void;
}

interface deleteItemFunction {
  (data: object): object[] | void;
}

export interface SchemeInterface {
  schemeName: string;
  schemePath: string;
  schemeFilePath: string;
  schemeInfo: SchemeInfo;
  db: DBInterface;
  getTable: getTableFunction;
}

export interface TableInterface {
  scheme: SchemeInterface;
  tableName: string;
  tableFilePath: string;
  getData: getDataFunction;
  insertItem: insertItemFunction;
  updateItem: updateItemFunction;
  deleteItem: deleteItemFunction;
}
