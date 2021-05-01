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
  dbPath: string;
};

export type SeederData = {
  path: string,
  items: object[]
}

export type SeederOptions = {
  dbPath: string,
  name: string,
  data: SeederData[]
}

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

export type MigrateFieldData = {
  name: string;
  type: string;
  primary_key?: boolean,
  nullable?: boolean
}

export type MigrateTableData = {
  name: string;
  fields: TableFieldData[]
}

export type MigrateSchemeData = {
  name: string,
  tables: MigrateTableData[]
}

export type MigrateOptions = {
  dbPath: string;
  name: string;
  schemes: MigrateSchemeData[];
}

export type TableFieldData = {
  name: string;
  type: string;
  primary_key: boolean,
  nullable: boolean
}
