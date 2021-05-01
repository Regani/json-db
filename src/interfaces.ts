import { SchemeInfo, DBInfo } from './types';

export interface DBInterface {
  dbPath: string;
  dbFilePath: string;
  dbInfo: DBInfo;
}

type getDataFunction = () => object[];

type getTableFunction = (tableName: string) => TableInterface | undefined;

type insertItemFunction = (data: object) => object[] | void;

type updateItemFunction = (data: object) => object[] | void;

type deleteItemFunction = (data: object) => object[] | void;

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
