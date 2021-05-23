import path = require('path');
import fs = require('fs');

import { INVALID_DB_PATH, VALID_MIGRATION_PARAMS } from './const';

import { Migrate } from '../src';
import { MigrateInterface, MigrateOptions } from '../src/interfaces';

const INVALID_PATH_MIGRATION_PARAMS: MigrateOptions = {
  ...VALID_MIGRATION_PARAMS,
  dbPath: INVALID_DB_PATH,
  name: VALID_MIGRATION_PARAMS.name,
};
const TWO_PRIMARY_FIELDS_MIGRATION_PARAMS: MigrateOptions = {
  ...VALID_MIGRATION_PARAMS,
  schemes: VALID_MIGRATION_PARAMS.schemes.map((scheme) => {
    return {
      ...scheme,
      tables: scheme.tables.map((table) => {
        return {
          ...table,
          fields: [
            {
              name: 'id',
              type: 'number',
              nullable: false,
              primary_key: true,
            },
            {
              name: 'age',
              type: 'number',
              nullable: true,
              primary_key: true,
            },
          ],
        };
      }),
    };
  }),
};
const INVALID_FIELD_TYPE_MIGRATION_PARAMS: MigrateOptions = {
  ...VALID_MIGRATION_PARAMS,
  schemes: VALID_MIGRATION_PARAMS.schemes.map((scheme) => {
    return {
      ...scheme,
      tables: scheme.tables.map((table) => {
        return {
          ...table,
          fields: [
            {
              name: 'name',
              type: 'array',
              nullable: false,
              primary_key: false,
            },
          ],
        };
      }),
    };
  }),
};
const INVALID_PRIMARY_KEY_FIELD_TYPE_MIGRATION_PARAMS: MigrateOptions = {
  ...VALID_MIGRATION_PARAMS,
  schemes: VALID_MIGRATION_PARAMS.schemes.map((scheme) => {
    return {
      ...scheme,
      tables: scheme.tables.map((table) => {
        return {
          ...table,
          fields: [
            {
              name: 'id',
              type: 'string',
              nullable: false,
              primary_key: true,
            },
          ],
        };
      }),
    };
  }),
};
const WITHOUT_PRIMARY_KEY_MIGRATION_PARAMS: MigrateOptions = {
  ...VALID_MIGRATION_PARAMS,
  schemes: VALID_MIGRATION_PARAMS.schemes.map((scheme) => {
    return {
      ...scheme,
      tables: scheme.tables.map((table) => {
        return {
          ...table,
          fields: [
            {
              name: 'id',
              type: 'string',
              nullable: false,
              primary_key: false,
            },
          ],
        };
      }),
    };
  }),
};

export const testMigrations = () =>
  describe('Test Migrations', () => {
    const pathToDatabaseFolder = path.join(VALID_MIGRATION_PARAMS.dbPath, VALID_MIGRATION_PARAMS.name);
    fs.rmdirSync(pathToDatabaseFolder, { recursive: true });

    function getMigrateFunction(migrateInstance: MigrateInterface) {
      return migrateInstance.migrate.bind(migrateInstance);
    }

    test('Catch wrong path provided', () => {
      const MigrationWithWrongPath = new Migrate(INVALID_PATH_MIGRATION_PARAMS);

      expect(getMigrateFunction(MigrationWithWrongPath)).toThrowError(TypeError);
    });

    test('Catch two primary keys', () => {
      const MigrationWithTwoPrimaryKeys = new Migrate(TWO_PRIMARY_FIELDS_MIGRATION_PARAMS);

      expect(getMigrateFunction(MigrationWithTwoPrimaryKeys)).toThrowError(TypeError);
    });

    test('Catch invalid field type', () => {
      const MigrationWithTwoPrimaryKeys = new Migrate(INVALID_FIELD_TYPE_MIGRATION_PARAMS);

      expect(getMigrateFunction(MigrationWithTwoPrimaryKeys)).toThrowError(TypeError);
    });

    test('Catch invalid primary key field type', () => {
      const MigrationInvalidPrimaryKeyFieldType = new Migrate(INVALID_PRIMARY_KEY_FIELD_TYPE_MIGRATION_PARAMS);

      expect(getMigrateFunction(MigrationInvalidPrimaryKeyFieldType)).toThrowError(TypeError);
    });

    test('Primary key is not required', () => {
      const MigrationInvalidPrimaryKeyFieldType = new Migrate(INVALID_PRIMARY_KEY_FIELD_TYPE_MIGRATION_PARAMS);

      expect(getMigrateFunction(MigrationInvalidPrimaryKeyFieldType)).toThrowError(TypeError);
    });

    test('Folder is not empty', () => {
      const MyMigration = new Migrate(VALID_MIGRATION_PARAMS);

      fs.mkdirSync(pathToDatabaseFolder);

      expect(MyMigration.migrate.bind(MyMigration)).toThrowError(TypeError);
    });

    test('Migrate without primary', () => {
      fs.rmdirSync(pathToDatabaseFolder, { recursive: true });

      const MigrationWithoutPrimaryKeyFieldType = new Migrate(WITHOUT_PRIMARY_KEY_MIGRATION_PARAMS);

      spyOn(MigrationWithoutPrimaryKeyFieldType, 'migrate').and.callThrough();
      MigrationWithoutPrimaryKeyFieldType.migrate();

      expect(MigrationWithoutPrimaryKeyFieldType.migrate).toHaveBeenCalled();
    });

    test('Migrate DB', () => {
      const MyMigration = new Migrate(VALID_MIGRATION_PARAMS);

      fs.rmdirSync(pathToDatabaseFolder, { recursive: true });

      spyOn(MyMigration, 'migrate').and.callThrough();
      MyMigration.migrate();

      expect(MyMigration.migrate).toHaveBeenCalled();
    });

    test('DB created correctly', () => {
      expect(JSON.stringify(JSON.parse(fs.readFileSync(path.join(pathToDatabaseFolder, 'db.json'), 'utf-8')))).toBe(
        JSON.stringify({
          schemes: VALID_MIGRATION_PARAMS.schemes.map((scheme) => scheme.name),
        }),
      );
    });

    test('Schemes created correctly', () => {
      VALID_MIGRATION_PARAMS.schemes.forEach((scheme) => {
        const pathToSchemeFolder = path.join(pathToDatabaseFolder, scheme.name);

        expect(
          JSON.stringify(
            JSON.parse(fs.readFileSync(path.join(pathToSchemeFolder, `${scheme.name}__scheme_config.json`), 'utf-8')),
          ),
        ).toBe(
          JSON.stringify({
            name: scheme.name,
            tables: scheme.tables.map((table) => table.name),
          }),
        );
      });
    });

    test('Tables created correctly', () => {
      VALID_MIGRATION_PARAMS.schemes.forEach((scheme) => {
        const pathToSchemeFolder = path.join(pathToDatabaseFolder, scheme.name);

        scheme.tables.forEach((table) => {
          expect(
            JSON.stringify(
              JSON.parse(fs.readFileSync(path.join(pathToSchemeFolder, `${table.name}__table.json`), 'utf-8')),
            ),
          ).toBe(
            JSON.stringify({
              name: table.name,
              fields: table.fields,
              data: [],
            }),
          );
        });
      });
    });
  });
