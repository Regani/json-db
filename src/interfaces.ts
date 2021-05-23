import {
  deleteItemFunction,
  getDataFunction,
  getFieldsFunction,
  getSchemeFunction,
  getSchemesFunction,
  getTableFunction,
  getTablesFunction,
  insertItemFunction,
  migrateFunction,
  seedFunction,
  updateItemFunction,
} from './types';

// DB
export interface DBOptions {
  dbPath: string;
}
export interface DBInterface {
  path: string;
  schemes: SchemeInterface[];
  getSchemes: getSchemesFunction;
  getScheme: getSchemeFunction;
}
// Scheme
export interface SchemeOptions {
  schemeName: string;
  db: DBInterface;
}
export interface SchemeInterface {
  name: string;
  path: string;
  tables: TableInterface[];
  getTables: getTablesFunction;
  getTable: getTableFunction;
}
// Table
export interface TableOptions {
  tableName: string;
  scheme: SchemeInterface;
}
export interface TableInterface {
  name: string;
  tableFilePath: string;
  getFields: getFieldsFunction;
  getData: getDataFunction;
  insertItem: insertItemFunction;
  updateItem: updateItemFunction;
  deleteItem: deleteItemFunction;
}
export interface TableDataItem {
  [key: string]: number | string | boolean | null;
}
export interface TableFieldData {
  name: string;
  type: string;
  primary_key: boolean;
  nullable: boolean;
}
export interface TableFileData {
  name: string;
  fields: TableFieldData[];
  data: TableDataItem[];
}
// Migrate
export interface MigrateOptions {
  dbPath: string;
  name: string;
  schemes: MigrateSchemeData[];
}
export interface MigrateInterface {
  options: MigrateOptions;
  migrate: migrateFunction;
}
export interface MigrateTableData {
  name: string;
  fields: TableFieldData[];
}
export interface MigrateSchemeData {
  name: string;
  tables: MigrateTableData[];
}
// Seeder
export interface SeederOptions {
  dbPath: string;
  name: string;
  data: SeederData[];
}
export interface SeederInterface {
  options: SeederOptions;
  seed: seedFunction;
}
export interface SeederData {
  path: string;
  items: TableDataItem[];
}
