import { DBInterface, SchemeInterface, TableInterface } from './interfaces';

export type SchemeOptions = {
  schemeName: string;
  db: DBInterface;
};

export type SchemeInfo = {
  name: string;
  tables: TableInterface[];
};

export type DBOptions = {
  dbpath: string;
};

export type DBInfo = {
  schemes: SchemeInterface[];
};

export type TableOptions = {
  tableName: string;
  scheme: SchemeInterface;
};

export type TableFileData = {
  name: string;
  fields: object[];
  data: object[];
};


export type TableField = {
  name: string;
  type: string;
  primary_key: boolean,
  nullable: boolean
}
