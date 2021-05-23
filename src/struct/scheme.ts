import fs = require('fs');
import nodePath = require('path');

import { SchemeInterface, TableInterface } from '../interfaces';
import { SchemeOptions } from '../interfaces';

import { Table } from './table';

export class Scheme implements SchemeInterface {
  name: string;
  path: string;
  tables: TableInterface[];

  constructor(options: SchemeOptions) {
    this.name = options.schemeName;
    this.path = nodePath.join(options.db.path, this.name);

    const schemeFilePath = nodePath.join(this.path, `${this.name}__scheme_config.json`);

    if (!fs.existsSync(schemeFilePath)) {
      throw new TypeError(`Scheme does not exist: ${this.name}`);
    }

    const schemeInfo = JSON.parse(fs.readFileSync(schemeFilePath, { encoding: 'utf8' }));

    this.tables = schemeInfo.tables.map((table: string) => {
      return new Table({
        scheme: this,
        tableName: table,
      });
    });
  }

  getTables(): string[] {
    return this.tables.map((table: TableInterface) => {
      return table.name;
    });
  }

  getTable(tableName: string): TableInterface {
    const foundTable = this.tables.find((table: TableInterface) => {
      return table.name === tableName;
    });

    if (!foundTable) {
      throw new TypeError(`Table with name ${tableName} does not exists.`);
    }

    return foundTable;
  }
}
