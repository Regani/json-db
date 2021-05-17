import {
  deleteItemFunction,
  getFieldsFunction,
  getDataFunction,
  getSchemeFunction,
  getSchemesFunction,
  getTableFunction,
  getTablesFunction,
  insertItemFunction,
  migrateFunction,
  MigrateOptions,
  SeederOptions,
  seedFunction,
  updateItemFunction,
} from './types';

export interface DBInterface {
  path: string;
  schemes: SchemeInterface[];
  getSchemes: getSchemesFunction;
  getScheme: getSchemeFunction;
}

export interface MigrateInterface {
  options: MigrateOptions;
  migrate: migrateFunction;
}

export interface SeederInterface {
  options: SeederOptions;
  seed: seedFunction;
}

export interface SchemeInterface {
  name: string;
  path: string;
  tables: TableInterface[];
  getTables: getTablesFunction;
  getTable: getTableFunction;
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
