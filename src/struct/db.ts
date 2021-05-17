import { DBInterface, SchemeInterface } from '../interfaces';
import { DBOptions } from '../types';

import { Scheme } from './scheme';
import fs = require('fs');
import nodePath = require('path');

export class DataBase implements DBInterface {
  path: string;
  schemes: SchemeInterface[];

  constructor(options: DBOptions) {
    this.path = options.dbPath;
    const filePath = nodePath.join(this.path, 'db.json');

    if (!fs.existsSync(filePath)) {
      throw new TypeError('No database under ' + filePath);
    }

    const dbInfo = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));

    this.schemes = dbInfo.schemes.map((scheme: string) => {
      return new Scheme({
        db: this,
        schemeName: scheme,
      });
    });
  }

  getSchemes(): string[] {
    return this.schemes.map((scheme: SchemeInterface) => {
      return scheme.name;
    });
  }

  getScheme(schemeName: string): SchemeInterface {
    const foundScheme = this.schemes.find((scheme: SchemeInterface) => {
      return scheme.name === schemeName;
    });

    if (!foundScheme) {
      throw new TypeError(`Scheme with name ${schemeName} does not exists.`);
    }

    return foundScheme;
  }
}
