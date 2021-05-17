import path = require('path');

import { DB_NAME, DB_PATH, INVALID_TABLE_PATH, VALID_MIGRATION_PARAMS } from './const';

import { DataBase, Scheme } from '../src';

export const testDatabase = () => {
  describe('Test Database', () => {
    test('Catch wrong path provided', () => {
      expect(() => {
        new DataBase({ dbPath: INVALID_TABLE_PATH });
      }).toThrowError(TypeError);
    });

    test('Get Schemes', () => {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });

      const actualSchemeList: string[] = VALID_MIGRATION_PARAMS.schemes.map((scheme) => scheme.name);

      expect(MyDataBase.getSchemes()).toEqual(actualSchemeList);
    });

    test('getScheme catch wrong scheme provided', () => {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });

      expect(MyDataBase.getScheme.bind(MyDataBase, 'not-exists-scheme')).toThrowError(TypeError);
    });

    test('Get scheme', () => {
      const MyDataBase = new DataBase({ dbPath: path.join(DB_PATH, DB_NAME) });

      const schemeToTestName: string = VALID_MIGRATION_PARAMS.schemes[0].name;

      const ExpectedSchemeInstance = new Scheme({ schemeName: schemeToTestName, db: MyDataBase });

      expect(MyDataBase.getScheme(schemeToTestName)).toBeInstanceOf(Scheme);
      expect(MyDataBase.getScheme(schemeToTestName)).toEqual(ExpectedSchemeInstance);
    });
  })
}
