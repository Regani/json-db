import fs = require('fs');
import path = require('path');

import {SeederOptions} from '../types';
import {DataBase} from '../index';

export class Seeder {
  options: SeederOptions;

  constructor(seedOptions: SeederOptions) {
    this._validateOptions(seedOptions);

    this.options = seedOptions;
  }

  seed() {
    const DbInstance = new DataBase({dbPath: path.join(this.options.dbPath, this.options.name)});

    this.options.data.forEach(el => {
      el.items.forEach(item => {
        DbInstance.insertItemInto(el.path, item);
      })
    })
  }

  _validateOptions(seedOptions: SeederOptions) {
    const dbFolderPath = path.join(seedOptions.dbPath, seedOptions.name);

    if (!fs.existsSync(path.join(dbFolderPath, 'db.json'))) {
      throw new Error('Database does not exist.')
    }

    if (seedOptions.data && seedOptions.data.length) {
      seedOptions.data.forEach(el => {
        const tableName = el.path.split('.')[1];

        if (fs.existsSync(path.join(dbFolderPath, el.path, `${tableName}__table.json`))) {
          throw new Error(`Table with name ${tableName} does not exists.`)
        }
      })
    }
  }
}
