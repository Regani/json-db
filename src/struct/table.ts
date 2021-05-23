import fs = require('fs');
import nodePath = require('path');

import { TableDataItem, TableFieldData, TableFileData, TableOptions } from '../interfaces';
import { TableInterface } from '../interfaces';

export class Table implements TableInterface {
  name: string;
  tableFilePath: string;

  constructor(options: TableOptions) {
    this.name = options.tableName;
    this.tableFilePath = nodePath.join(options.scheme.path, `${this.name}__table.json`);

    if (!fs.existsSync(this.tableFilePath)) {
      throw new TypeError(`Table does not exist: ${this.name}`);
    }
  }

  getFields(): TableFieldData[] {
    return this._readFile().fields;
  }

  getData(): TableDataItem[] {
    return this._readFile().data;
  }

  insertItem(itemToInsert: TableDataItem): TableDataItem[] {
    this._validate(itemToInsert);

    const primaryKey = this._getPrimaryKeyName();
    const allItems = this.getData();
    const ids = allItems.map((item) => item[primaryKey]) as number[];

    const lastId = ids.length ? Math.max(...ids) : 0;

    allItems.push({
      ...this._mapToValidObject(itemToInsert),
      [primaryKey]: lastId + 1,
    });

    this._updateData(allItems);

    return this.getData();
  }

  updateItem(itemToUpdate: TableDataItem): TableDataItem[] {
    this._validate(itemToUpdate);

    const primaryKey = this._getPrimaryKeyName();
    const data = this.getData();

    const itemToUpdateIndex = data.findIndex((el) => el[primaryKey] === itemToUpdate[primaryKey]);

    if (itemToUpdateIndex === -1) {
      throw new TypeError('Item does not exist.');
    }

    data.splice(itemToUpdateIndex, 1, this._mapToValidObject(itemToUpdate));

    this._updateData(data);

    return this.getData();
  }

  deleteItem(itemToDelete: TableDataItem): TableDataItem[] {
    const primaryKey = this._getPrimaryKeyName();
    const data = this.getData();

    const itemToDeleteIndex = data.findIndex((el) => el[primaryKey] === itemToDelete[primaryKey]);

    if (itemToDeleteIndex === -1) {
      throw new TypeError('Item does not exist.');
    }

    data.splice(itemToDeleteIndex, 1);

    this._updateData(data);

    return this.getData();
  }

  _validate(item: TableDataItem): void {
    const tableFields = this.getFields();
    const itemFields = Object.keys(item);

    const notNullableFields = tableFields
      .filter((field) => !field.nullable && !field.primary_key)
      .map((field) => field.name);

    const allNutNullablesFilled = notNullableFields.every((field) => {
      return itemFields.includes(field) && !(item[field] === null || item[field] === undefined);
    });

    if (!allNutNullablesFilled) {
      throw new TypeError('Not nullable fields are not provided');
    }

    const tableFieldsNames = tableFields.map((field) => field.name);
    const onlyExpectedItemFields = itemFields.filter((field) => tableFieldsNames.includes(field));

    const validDataTypes = onlyExpectedItemFields.every((field) => {
      const foundTableField = tableFields.find((tableField) => tableField.name === field) as { type: string };

      return typeof item[field] === foundTableField.type;
    });

    if (!validDataTypes) {
      throw new TypeError('Invalid data.');
    }
  }

  _getPrimaryKeyName(): string {
    const primaryField = this.getFields().find((field) => field.primary_key) as { name: string };

    return primaryField.name;
  }

  _mapToValidObject(item: TableDataItem): TableDataItem {
    const validFields = this.getFields().map((field) => field.name);

    const validData: TableDataItem = {};

    validFields.forEach((field) => {
      validData[field] = item[field] !== undefined ? item[field] : null;
    });

    return validData;
  }

  _updateData(data: TableDataItem[]): void {
    const field = this._readFile();

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
