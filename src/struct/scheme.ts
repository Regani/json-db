import { DBInterface, SchemeInterface, TableInterface } from '../interfaces';
import { SchemeInfo, SchemeOptions } from '../types';

import { Table } from './table';

const fs = require('fs');
const path = require('path');

export class Scheme implements SchemeInterface {
  db: DBInterface;
  schemeName: string = '';
  schemePath: string = '';
  schemeFilePath: string = '';
  schemeInfo: SchemeInfo = {
    name: '',
    tables: [],
  };

  constructor(options: SchemeOptions) {
    this.db = options.db;
    this.schemeName = options.schemeName;
    this.schemePath = path.join(this.db.dbpath, this.schemeName);
    this.schemeFilePath = path.join(this.schemePath, `${this.schemeName}__scheme_config.json`);

    this.init();
  }

  init(): void {
    const schemeInfo = JSON.parse(fs.readFileSync(this.schemeFilePath, { encoding: 'utf8' }));

    this.schemeInfo = {
      ...schemeInfo,
      tables: schemeInfo.tables.map((table: string) => {
        return new Table({
          scheme: this,
          tableName: table,
        });
      }),
    };
  }

  getTable(tableName: string): TableInterface | undefined {
    return this.schemeInfo.tables.find((table: TableInterface) => {
      return (table.tableName = tableName);
    });
  }
}
