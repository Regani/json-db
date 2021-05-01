import { TableOptions, TableFileData, TableField } from '../types';
import { SchemeInterface, TableInterface } from '../interfaces';

const fs = require('fs');
const path = require('path');

export class Table implements TableInterface {
  scheme: SchemeInterface;
  tableName: string = '';
  tableFilePath: string = '';

  constructor(options: TableOptions) {
    this.scheme = options.scheme;
    this.tableName = options.tableName;
    this.tableFilePath = path.join(this.scheme.schemePath, `${this.tableName}__table_config.json`);
  }

  getData(): object[] {
    return this._readFile().data;
  }

  getFields(): TableField[] {
    // @ts-ignore
    return this._readFile().fields;
  }

  insertItem(item: object): object[] | void {
    const isValid = this._validate(item);

    if (!isValid) {
      return console.error('Item is not valid');
    }

    const primaryKey = this._getPrimaryKey();
    const data = this.getData();
    // @ts-ignore
    const lastId = Math.max(...data.map((el) => el[primaryKey]));

    data.push({
      ...this._mapToValidObject(item),
      [primaryKey]: lastId + 1,
    });

    this._updateData(data);

    return this.getData();
  }

  updateItem(item: object): object[] | void {
    const isValid = this._validate(item);

    if (!isValid) {
      return console.error('Item is not valid');
    }

    const primaryKey = this._getPrimaryKey();
    const data = this.getData();

    // @ts-ignore
    const itemToUpdateIndex = data.findIndex((el) => el[primaryKey] === item[primaryKey]);

    if (itemToUpdateIndex === -1) {
      return console.error('Item does not exist.');
    }

    data.splice(itemToUpdateIndex, 1, this._mapToValidObject(item));

    this._updateData(data);

    return this.getData();
  }

  deleteItem(item: object): object[] | void {
    const primaryKey = this._getPrimaryKey();
    const data = this.getData();

    // @ts-ignore
    const itemToDeleteIndex = data.findIndex((el) => el[primaryKey] === item[primaryKey]);

    if (itemToDeleteIndex === -1) {
      return console.error('Item does not exist.');
    }

    data.splice(itemToDeleteIndex, 1);

    this._updateData(data);

    return this.getData();
  }

  _validate(item: object): boolean {
    // @ts-ignore
    const notNullableFields = this.getFields()
      .filter((field) => !field.nullable && !field.primary_key)
      .map((field) => field.name);

    const itemFields = Object.keys(item);

    if (notNullableFields.length && !itemFields.length) {
      return false;
    }

    return notNullableFields.every((field) => {
      // @ts-ignore
      return itemFields.includes(field) && !(item[field] === null || item[field] === undefined);
    });
  }

  _getPrimaryKey(): number {
    // @ts-ignore
    return this.getFields().find((field: object[]) => field.primary_key).name;
  }

  _mapToValidObject(item: object): object {
    // @ts-ignore
    const validFields = this.getFields().map((field) => field.name);

    let validData = {};
    validFields.forEach((field) => {
      // @ts-ignore
      validData[field] = item[field];
    });

    return validData;
  }

  _updateData(data: object): void {
    let field = this._readFile();
    // @ts-ignore
    field.data = data;
    this._writeFile(field);
  }

  _readFile(): TableFileData {
    return JSON.parse(fs.readFileSync(this.tableFilePath, { encoding: 'utf8' }));
  }

  _writeFile(data: object): void {
    fs.writeFileSync(this.tableFilePath, JSON.stringify(data, null, 2));
  }
}
