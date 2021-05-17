import path = require('path');
import fs = require('fs');

import { DB_NAME, DB_PATH, INVALID_DB_PATH, INVALID_TABLE_PATH, TABLE_ITEMS_TO_SEED, TABLE_PATH } from './const';

import { Seeder } from '../src';
import { SeederData, SeederOptions } from '../src/types';
import { SeederInterface } from '../src/interfaces';
import { getPrimaryKeyName, mapWithPrimary } from './helper';

const VALID_SEEDER_PARAMS: SeederOptions = {
  dbPath: DB_PATH,
  name: DB_NAME,
  data: [
    {
      path: TABLE_PATH,
      items: TABLE_ITEMS_TO_SEED,
    },
  ],
};
const INVALID_PATH_SEEDER_PARAMS: SeederOptions = {
  ...VALID_SEEDER_PARAMS,
  dbPath: INVALID_DB_PATH,
};
const INVALID_TABLE_NAME_SEEDER_PARAMS: SeederOptions = {
  ...VALID_SEEDER_PARAMS,
  data: VALID_SEEDER_PARAMS.data.map((el) => {
    return {
      path: INVALID_TABLE_PATH,
      items: el.items,
    };
  }),
};

export const testSeeder = () =>
  describe('Test Seeder', () => {
    const pathToDatabaseFolder = path.join(DB_PATH, DB_NAME);

    function getSeedFunction(seederInstance: SeederInterface) {
      return seederInstance.seed.bind(seederInstance);
    }

    test('Catch wrong database path provided', () => {
      const SeederWithWrongPath = new Seeder(INVALID_PATH_SEEDER_PARAMS);

      expect(getSeedFunction(SeederWithWrongPath)).toThrowError(TypeError);
    });

    test('Catch wrong table name provided', () => {
      const SeederWithWrongTablePath = new Seeder(INVALID_TABLE_NAME_SEEDER_PARAMS);

      expect(getSeedFunction(SeederWithWrongTablePath)).toThrowError(TypeError);
    });

    test('Seed DB', () => {
      const MySeeder = new Seeder(VALID_SEEDER_PARAMS);

      spyOn(MySeeder, 'seed').and.callThrough();
      MySeeder.seed();

      expect(MySeeder.seed).toHaveBeenCalled();
    });

    test('DB filled correctly', () => {
      VALID_SEEDER_PARAMS.data.forEach((table: SeederData) => {
        const schemeName = table.path.split('.')[0];
        const tableName = table.path.split('.')[1];
        const pathToTable = path.join(pathToDatabaseFolder, schemeName, `${tableName}__table.json`);
        const actualTableInfo = JSON.parse(fs.readFileSync(pathToTable, 'utf-8'));
        const primaryKeyName: string = getPrimaryKeyName(actualTableInfo.fields);
        const expectedTableData = mapWithPrimary(primaryKeyName, table.items);

        expect(expectedTableData).toEqual(actualTableInfo.data);
        expect(primaryKeyName).not.toBe(undefined);
      });
    });
  });
