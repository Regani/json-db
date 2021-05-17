import fs = require('fs');
import path = require('path');

import { SeederOptions } from '../types';
import { SeederInterface } from '../interfaces';
import { DataBase } from '../index';

export class Seeder implements SeederInterface {
  options: SeederOptions;

  constructor(seederOptions: SeederOptions) {
    this.options = seederOptions;
  }

  seed(): void | TypeError {
    this._validateOptions();

    const DbInstance = new DataBase({ dbPath: path.join(this.options.dbPath, this.options.name) });

    this.options.data.forEach((el) => {
      const [schemeName, tableName] = el.path.split('.');

      const scheme = DbInstance.getScheme(schemeName);
      const table = scheme.getTable(tableName);

      el.items.forEach((item) => {
        table.insertItem(item);
      });
    });
  }

  _validateOptions() {
    const dbFolderPath = path.join(this.options.dbPath, this.options.name);

    if (!fs.existsSync(path.join(dbFolderPath, 'db.json'))) {
      throw new TypeError('Database does not exist.');
    }

    this.options.data.forEach((el) => {
      const schemeName = el.path.split('.')[0];
      const tableName = el.path.split('.')[1];

      if (!fs.existsSync(path.join(dbFolderPath, schemeName, `${tableName}__table.json`))) {
        throw new TypeError(`Table with name ${tableName} does not exists.`);
      }
    });
  }
}
