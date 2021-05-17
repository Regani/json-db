import { DBInterface, SchemeInterface, TableInterface } from './interfaces';

export type TableDataItem = { [key: string]: number | string | boolean | null };

export type SchemeOptions = {
  schemeName: string;
  db: DBInterface;
};

export type SchemeInfo = {
  name: string;
  tables: TableInterface[];
};

export type DBOptions = {
  dbPath: string;
};

export type SeederData = {
  path: string;
  items: TableDataItem[];
};

export type SeederOptions = {
  dbPath: string;
  name: string;
  data: SeederData[];
};

export type TableOptions = {
  tableName: string;
  scheme: SchemeInterface;
};

export type TableFileData = {
  name: string;
  fields: TableFieldData[];
  data: TableDataItem[];
};

export type MigrateFieldData = TableFieldData;

export type MigrateTableData = {
  name: string;
  fields: TableFieldData[];
};

export type MigrateSchemeData = {
  name: string;
  tables: MigrateTableData[];
};

export type MigrateOptions = {
  dbPath: string;
  name: string;
  schemes: MigrateSchemeData[];
};

export type TableFieldData = {
  name: string;
  type: string;
  primary_key: boolean;
  nullable: boolean;
};

export type getSchemesFunction = () => string[];

export type getSchemeFunction = (tableName: string) => SchemeInterface;

export type migrateFunction = () => void;

export type getFieldsFunction = () => TableFieldData[];

export type getDataFunction = () => TableDataItem[];

export type getTablesFunction = () => string[];

export type getTableFunction = (tableName: string) => TableInterface;

export type insertItemFunction = (data: TableDataItem) => TableDataItem[];

export type updateItemFunction = (data: TableDataItem) => TableDataItem[];

export type deleteItemFunction = (data: TableDataItem) => TableDataItem[];

export type seedFunction = () => void | never;
