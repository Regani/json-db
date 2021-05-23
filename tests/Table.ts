import path = require('path');
import {
  DB_NAME,
  DB_PATH,
  INVALID_DATA_TYPE_TABLE_ITEM,
  INVALID_MISSING_NOT_NULLABLE_FIELD_TABLE_ITEM,
  TABLE_ITEMS_TO_SEED,
  VALID_MIGRATION_PARAMS,
} from './const';

import { DataBase, Scheme, Table } from '../src';

import { TableDataItem } from '../src/interfaces';

import { getLastItemWithInvalidId, getPrimaryKeyName, mapWithPrimary } from './helper';

export const testTable = () =>
  describe('Test Table', () => {
    const schemeToTest = VALID_MIGRATION_PARAMS.schemes[0];
    const tableToTest = schemeToTest.tables[0];

    function getTable() {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });
      const MyScheme = MyDataBase.getScheme(schemeToTest.name);

      return MyScheme.getTable(tableToTest.name);
    }

    test('Catch wrong path provided', () => {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });
      const MyScheme = new Scheme({ schemeName: schemeToTest.name, db: MyDataBase });

      expect(() => {
        new Table({ tableName: 'table-not-exists', scheme: MyScheme });
      }).toThrowError(TypeError);
    });

    test('getFields', () => {
      const MyTable = getTable();
      const expectedTableFields = tableToTest.fields;

      expect(MyTable.getFields()).toEqual(expectedTableFields);
    });

    test('getData', () => {
      const MyTable = getTable();
      const primaryKeyName: string = getPrimaryKeyName(tableToTest.fields);
      const expectedTableData = mapWithPrimary(primaryKeyName, TABLE_ITEMS_TO_SEED);

      expect(MyTable.getData()).toEqual(expectedTableData);
    });

    test('Catch not nullable fields are not provided', () => {
      const MyTable = getTable();

      expect(MyTable.insertItem.bind(MyTable, INVALID_MISSING_NOT_NULLABLE_FIELD_TABLE_ITEM)).toThrow(TypeError);
    });

    test('Catch invalid data provided', () => {
      const MyTable = getTable();

      expect(MyTable.insertItem.bind(MyTable, INVALID_DATA_TYPE_TABLE_ITEM)).toThrow(TypeError);
    });

    test('insertItem', () => {
      const MyTable = getTable();
      const primaryKeyName: string = getPrimaryKeyName(tableToTest.fields);
      const existingData = MyTable.getData() as [];
      const expectedId = existingData[existingData.length - 1][primaryKeyName] + 1;
      const itemToInsert = TABLE_ITEMS_TO_SEED[0];
      const expectedInsertedItem = {
        ...itemToInsert,
        [primaryKeyName]: expectedId,
      };
      MyTable.insertItem(itemToInsert);
      const currentItems = MyTable.getData();
      const lastItem = currentItems[currentItems.length - 1];

      expect(lastItem).toEqual(expectedInsertedItem);
    });

    test('Catch not existing item update', () => {
      const MyTable = getTable();
      const invalidData = getLastItemWithInvalidId(MyTable);

      expect(MyTable.updateItem.bind(MyTable, invalidData)).toThrow(TypeError);
    });

    test('updateItem', () => {
      const MyTable = getTable();
      const existingData = MyTable.getData() as TableDataItem[];
      const itemToUpdate = existingData[0];
      const updatedItem = {
        ...itemToUpdate,
        name: 'Updated Name',
      };
      MyTable.updateItem(updatedItem);

      expect(MyTable.getData()[0]).toEqual(updatedItem);
    });

    test('Catch not existing item delete', () => {
      const MyTable = getTable();
      const invalidData = getLastItemWithInvalidId(MyTable);

      expect(MyTable.deleteItem.bind(MyTable, invalidData)).toThrow(TypeError);
    });

    test('deleteItem', () => {
      const MyTable = getTable();
      const existingData = MyTable.getData() as TableDataItem[];
      const itemToDelete = existingData[0];
      const expectedDataAfterDelete = [...existingData];

      expectedDataAfterDelete.splice(0, 1);
      MyTable.deleteItem(itemToDelete);

      expect(MyTable.getData()).toEqual(expectedDataAfterDelete);
    });
  });
