import { testMigrations } from './Migrate';
import { testSeeder } from './Seeder';
import { testDatabase } from './Database';
import { testScheme } from './Scheme';
import { testTable } from './Table';

describe('Test JSON-DB', () => {
  testMigrations();
  testSeeder();
  testDatabase();
  testScheme();
  testTable();
});
