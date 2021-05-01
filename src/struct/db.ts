import { DBInterface, SchemeInterface, TableInterface } from '../interfaces';
import { DBInfo, DBOptions } from '../types';

import { Scheme } from './scheme';

const fs = require('fs');
const path = require('path');

export class DB implements DBInterface {
  dbpath: string = '';
  dbFilePath: string = '';
  dbInfo: DBInfo = {
    schemes: [],
  };

  constructor(options: DBOptions) {
    this.dbpath = options.dbpath;
    this.dbFilePath = path.join(this.dbpath, 'db.json');

    this.init();
  }

  init(): void {
    if (!fs.existsSync(this.dbpath)) {
      throw new Error('No database under ' + this.dbpath);
    }

    const dbInfo = JSON.parse(fs.readFileSync(this.dbFilePath, { encoding: 'utf8' }));

    this.dbInfo = {
      ...dbInfo,
      schemes: dbInfo.schemes.map((scheme: string) => {
        return new Scheme({
          db: this,
          schemeName: scheme,
        });
      }),
    };
  }

  getSchemes(): string[] {
    return this.dbInfo.schemes.map((scheme: SchemeInterface) => {
      return scheme.schemeName;
    });
  }

  getScheme(schemeName: string): SchemeInterface | undefined {
    return this.dbInfo.schemes.find((scheme: SchemeInterface) => {
      return (scheme.schemeName = schemeName);
    });
  }

  getData(path: string): object[] | void {
    const table = this._getTableByPath(path);

    if (!table) {
      const { tableName } = this._splitPath(path);

      return console.error(`Table with name ${tableName} not exists.`);
    }

    return table.getData();
  }

  insertItemInto(path: string, data: object): object[] | void {
    const table = this._getTableByPath(path);

    if (!table) {
      const { tableName } = this._splitPath(path);

      return console.error(`Table with name ${tableName} not exists.`);
    }

    return table.insertItem(data);
  }

  updateItemInto(path: string, data: object): object[] | void {
    const table = this._getTableByPath(path);

    if (!table) {
      const { tableName } = this._splitPath(path);

      return console.error(`Table with name ${tableName} not exists.`);
    }

    return table.updateItem(data);
  }

  deleteItemInto(path: string, data: object): void {
    const table = this._getTableByPath(path);

    if (!table) {
      const { tableName } = this._splitPath(path);

      return console.error(`Table with name ${tableName} not exists.`);
    }

    table.deleteItem(data);
  }

  _validatePath(path: string): boolean {
    let valid = true;
    const { schemeName, tableName } = this._splitPath(path);

    if (!schemeName) {
      console.error(`Scheme is not provided.`);

      valid = false;
    }

    if (!tableName) {
      console.error(`Table is not provided.`);

      valid = false;
    }

    return valid;
  }

  _splitPath(path: string): { schemeName: string; tableName: string } {
    const [schemeName, tableName] = path.split('.');

    return { schemeName, tableName };
  }

  _getSchemeByPath(path: string): SchemeInterface | undefined {
    const pathValid = this._validatePath(path);

    if (!pathValid) {
      return;
    }

    const { schemeName } = this._splitPath(path);

    return this.getScheme(schemeName);
  }

  _getTableByPath(path: string): TableInterface | undefined {
    const pathValid = this._validatePath(path);

    if (!pathValid) {
      return;
    }

    const { tableName } = this._splitPath(path);

    const scheme = this._getSchemeByPath(path);

    if (!scheme) {
      return;
    }

    return scheme.getTable(tableName);
  }
}
