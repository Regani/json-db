import { SchemeInterface, TableDataItem, TableFieldData, TableInterface } from './interfaces';

// DB
export type getSchemesFunction = () => string[];
export type getSchemeFunction = (tableName: string) => SchemeInterface;
// Scheme
export type getTablesFunction = () => string[];
export type getTableFunction = (tableName: string) => TableInterface;
// Table
export type getFieldsFunction = () => TableFieldData[];
export type getDataFunction = () => TableDataItem[];
export type insertItemFunction = (data: TableDataItem) => TableDataItem[];
export type updateItemFunction = (data: TableDataItem) => TableDataItem[];
export type deleteItemFunction = (data: TableDataItem) => TableDataItem[];
// Migrate
export type migrateFunction = () => void;
// Seeder
export type seedFunction = () => void | never;
