import { MigrateFieldData, MigrateOptions, MigrateSchemeData, MigrateTableData } from "../types";

import nodePath = require('path');
import fs = require('fs');

export class Migrate {
  options: MigrateOptions;

  constructor(options: MigrateOptions) {
    this._validateOptions(options)

    this.options = this._upFillOptions(options);
  }

  migrate() {
    if (!fs.existsSync(this.options.dbPath)) {
      throw new Error('Path is not valid!');
    }

    const dbFolderPath = nodePath.join(this.options.dbPath, this.options.name)

    if (fs.existsSync(dbFolderPath)) {
      fs.rmdirSync(dbFolderPath, { recursive: true });
    }

    fs.mkdirSync(dbFolderPath);

    fs.writeFileSync(
      nodePath.join(dbFolderPath, 'db.json'),
      JSON.stringify(
        {
          schemes: this.options.schemes ? this.options.schemes.map(scheme => scheme.name) : []
        },
        null,
        2
        ));

    if (this.options.schemes && this.options.schemes.length) {
      this.options.schemes.forEach(scheme => {
        const schemeFolderPath = nodePath.join(dbFolderPath, scheme.name);

        fs.mkdirSync(schemeFolderPath);

        fs.writeFileSync(
          nodePath.join(schemeFolderPath, `${scheme.name}__scheme_config.json`),
          JSON.stringify(
            {
              name: scheme.name,
              tables: scheme.tables ? scheme.tables.map(table => table.name) : []
            },
            null,
            2
          ));

        if (scheme.tables && scheme.tables.length) {
          scheme.tables.forEach(table => {
            fs.writeFileSync(
              nodePath.join(schemeFolderPath, `${table.name}__table.json`),
              JSON.stringify(
                {
                  name: table.name,
                  fields: table.fields
                },
                null,
                2
              ));
          })
        }
      })
    }
  }

  _upFillOptions(options: MigrateOptions): MigrateOptions {
    return {
      ...options,
      schemes: options.schemes.map(scheme => {
        return {
          ...scheme,
          tables: scheme.tables.map(table => {
            return {
              ...table,
              fields: table.fields.map(field => {
                return {
                  ...field,
                  nullable: field.nullable === undefined ? true : field.nullable,
                  primary_key: field.primary_key === undefined ? false : field.primary_key,
                }
              })
            }
          })
        }
      })
    }
  }

  _validateOptions(options: MigrateOptions) {
    if (!options.schemes || !options.schemes.length) {
      return true;
    }

    options.schemes.every(scheme => this._isValidScheme(scheme));
  }

  _isValidScheme(scheme: MigrateSchemeData) {
    if (!scheme.tables.length) {
      return true;
    }

    return scheme.tables.every(table => this._isValidTable(table));
  }

  _isValidTable(table: MigrateTableData) {
    if (!table.fields.length) {
      return true;
    }

    return this._areValidField(table.fields);
  }

  _areValidField(fields: MigrateFieldData[]): boolean | Error {
    const primaryKeys = fields.filter(field => field.primary_key);
    const maximumOnePrimary = primaryKeys.length <= 1;

    if (!maximumOnePrimary) {
      throw new Error('Can be maximum one primary key!')
    }

    const hasName = fields.every(field => typeof field.name === 'string');

    if (!hasName) {
      throw new Error('Each field must have `name` property!');
    }

    const isValidType = fields.every(field => this._getValidTypes().includes(field.type))

    if (!isValidType) {
      throw new Error(`Must be a valid type. Valid types: ${this._getValidTypes()}`)
    }

    if (primaryKeys.length === 1) {
      const primaryIndex = fields.findIndex(field => field.primary_key);

      const isPrimaryValidType = fields[primaryIndex].type === 'number';

      if (!isPrimaryValidType) {
        throw new Error('Primary key must be type of `number`!');
      }
    }

    return true
  }

  _getValidTypes(): string[] {
    return ['number', 'string', 'boolean']
  }
}
