import path = require('path');
import { MigrateOptions } from '../src/types';

export const DB_PATH = path.join(__dirname, '../db');
export const DB_NAME = 'test-migrate-db';
export const SCHEME_NAME = 'test-migrate-scheme';
export const TABLE_NAME = 'test-migrate-table';
export const VALID_MIGRATION_PARAMS: MigrateOptions = {
  dbPath: DB_PATH,
  name: DB_NAME,
  schemes: [
    {
      name: SCHEME_NAME,
      tables: [
        {
          name: TABLE_NAME,
          fields: [
            {
              name: 'id',
              type: 'number',
              nullable: false,
              primary_key: true,
            },
            {
              name: 'name',
              type: 'string',
              nullable: false,
              primary_key: false,
            },
            {
              name: 'surname',
              type: 'string',
              nullable: true,
              primary_key: false,
            },
            {
              name: 'age',
              type: 'number',
              nullable: true,
              primary_key: false,
            },
            {
              name: 'isTeenager',
              type: 'boolean',
              nullable: false,
              primary_key: false,
            },
          ],
        },
      ],
    },
  ],
};
export const TABLE_PATH = `${SCHEME_NAME}.${TABLE_NAME}`;
export const INVALID_TABLE_PATH = `${SCHEME_NAME}.not-exists-table`;
export const INVALID_DB_PATH = 'not-exist/db';
export const TABLE_ITEMS_TO_SEED = [
  {
    name: 'Anton',
    surname: 'Patron',
    age: 23,
    isTeenager: false,
  },
  {
    name: 'Vasya',
    surname: 'Pupkin',
    age: 15,
    isTeenager: true,
  },
];
export const INVALID_MISSING_NOT_NULLABLE_FIELD_TABLE_ITEM = {
  surname: 'Patron',
  age: 23,
  isTeenager: false,
};
export const INVALID_DATA_TYPE_TABLE_ITEM = {
  name: false,
  surname: 'Patron',
  age: 23,
  isTeenager: false,
};
