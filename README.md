# JSON-DB
Small library that allows you to work with json files as with database.

## Installation

Using npm:
```shell
$ npm i -g npm
$ npm i json-db
```

## Database Usage
To create an DB instance use:
```
const {DataBase} = require('json-db');
const MyDataBase = new DataBase(DBOptions)
MyDataBase.init();
```

### DataBase Methods
- `getSchemes(): string[]` - returns the list of schemes names
- `getScheme(schemeName: string): SchemeInterface` - return the scheme instance by scheme name

### Scheme Methods
- `getTables(): string[]` - returns the list of tables names
- `getTable(tableName: string): TableInterface` - returns the table instance by table name

### Table Methods
- `getFields(): TableFieldData[]` - returns the list of table fields
- `getData(): TableDataItem[]` - returns the table data
- `insertItem(itemToInsert: TableDataItem): TableDataItem[]` - sets the new item and return list of all items
- `updateItem(itemToUpdate: TableDataItem): TableDataItem[]` - updates passed item and return list of all items
- `deleteItem(itemToDelete: TableDataItem): TableDataItem[]` - removes the item and return list of all items

## Migrations
You allowed use migrations to easily setup database and seed some data.

To use migrations do:
```
const {Migrate} = require('json-db');
const MyMigration = new Migrate(MigrateOptions)
MyMigration.migrate()
```

To use seeder do:
```
const {Seeder} = require('json-db');
const MySeeder = new Seeder(SeederOptions)
MySeeder.seed()
```

### Data instances
All the data instances are described in [interfaces](src/interfaces.ts)
