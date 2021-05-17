import path = require('path');

import { DB_NAME, DB_PATH, VALID_MIGRATION_PARAMS } from './const';

import { DataBase, Scheme, Table } from '../src';

export const testScheme = () =>
  describe('Test Scheme', () => {
    const schemeToTest = VALID_MIGRATION_PARAMS.schemes[0];

    function getScheme() {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });
      return MyDataBase.getScheme(schemeToTest.name);
    }

    test('Catch wrong path provided', () => {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });

      expect(() => {
        new Scheme({ schemeName: 'scheme-not-exists', db: MyDataBase });
      }).toThrowError(TypeError);
    });

    test('Get Tables', () => {
      const MyScheme = getScheme();

      const actualTableList: string[] = schemeToTest.tables.map((table) => table.name);

      expect(MyScheme.getTables()).toEqual(actualTableList);
    });

    test('getTable catch wrong scheme provided', () => {
      const MyScheme = getScheme();

      expect(MyScheme.getTable.bind(MyScheme, 'not-exists-table')).toThrowError(TypeError);
    });

    test('Get table', () => {
      const MyScheme = getScheme();

      const tableToTestName: string = schemeToTest.tables[0].name;

      const ExpectedTableInstance = new Table({ tableName: tableToTestName, scheme: MyScheme });

      expect(MyScheme.getTable(tableToTestName)).toBeInstanceOf(Table);
      expect(MyScheme.getTable(tableToTestName)).toEqual(ExpectedTableInstance);
    });
  });
