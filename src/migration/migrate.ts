import { MigrateInterface, MigrateOptions, MigrateSchemeData, MigrateTableData, TableFieldData } from '../interfaces';
import nodePath = require('path');
import fs = require('fs');

export class Migrate implements MigrateInterface {
  options: MigrateOptions;

  constructor(options: MigrateOptions) {
    this.options = this._upFillOptions(options);
  }

  migrate(): void {
    this._validateOptions();

    if (!fs.existsSync(this.options.dbPath)) {
      throw new TypeError('Path is not valid!');
    }

    const dbFolderPath = nodePath.join(this.options.dbPath, this.options.name);

    if (fs.existsSync(dbFolderPath)) {
      throw new TypeError(`Folder under path ${dbFolderPath} is not empty;`);
    }

    fs.mkdirSync(dbFolderPath);

    fs.writeFileSync(
      nodePath.join(dbFolderPath, 'db.json'),
      JSON.stringify(
        {
          schemes: this.options.schemes.map((scheme) => scheme.name),
        },
        null,
        2,
      ),
    );

    this.options.schemes.forEach((scheme) => {
      const schemeFolderPath = nodePath.join(dbFolderPath, scheme.name);

      fs.mkdirSync(schemeFolderPath);

      fs.writeFileSync(
        nodePath.join(schemeFolderPath, `${scheme.name}__scheme_config.json`),
        JSON.stringify(
          {
            name: scheme.name,
            tables: scheme.tables.map((table) => table.name),
          },
          null,
          2,
        ),
      );

      scheme.tables.forEach((table) => {
        fs.writeFileSync(
          nodePath.join(schemeFolderPath, `${table.name}__table.json`),
          JSON.stringify(
            {
              name: table.name,
              fields: table.fields,
              data: [],
            },
            null,
            2,
          ),
        );
      });
    });
  }

  _upFillOptions(options: MigrateOptions): MigrateOptions {
    return {
      ...options,
      schemes: options.schemes.map((scheme) => {
        return {
          ...scheme,
          tables: scheme.tables.map((table) => {
            return {
              name: table.name,
              fields: table.fields,
            };
          }),
        };
      }),
    };
  }

  _validateOptions() {
    this.options.schemes.every((scheme) => this._isValidScheme(scheme));
  }

  _isValidScheme(scheme: MigrateSchemeData) {
    return scheme.tables.every((table) => this._isValidTable(table));
  }

  _isValidTable(table: MigrateTableData) {
    return this._areValidField(table.fields);
  }

  _areValidField(fields: TableFieldData[]): void | TypeError {
    const primaryKeys = fields.filter((field) => field.primary_key);
    const maximumOnePrimary = primaryKeys.length <= 1;

    if (!maximumOnePrimary) {
      throw new TypeError('Can be maximum one primary key!');
    }

    const isValidType = fields.every((field) => this._getValidTypes().includes(field.type));

    if (!isValidType) {
      throw new TypeError(`Must be a valid type. Valid types: ${this._getValidTypes()}`);
    }

    if (primaryKeys.length >= 1) {
      const primaryIndex = fields.findIndex((field) => field.primary_key);

      const isPrimaryValidType = fields[primaryIndex].type === 'number';

      if (!isPrimaryValidType) {
        throw new TypeError('Primary key must be type of `number`!');
      }
    }
  }

  _getValidTypes(): string[] {
    return ['number', 'string', 'boolean'];
  }
}
