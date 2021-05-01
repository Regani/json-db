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
const MyDataBase = new DataBase({dbPath: <path_to_database_folder>})
```

### Data instances
- path - path to the table `<scheme_name>.<table_name>`

### Working with data
You have access to the following instances:
- DataBase - main instance, group of schemes
- Scheme - group of tables
- Table - like DB table

#### DataBase Methods
You have access to the following methods:

- `getSchemes(): string[]` - returns the list of schemes names
- `getScheme(schemeName: string): SchemeInterface | undefined` - return the scheme instance by scheme name. undefined in case scheme is not found
- `getData(path: string): object[] | void` - returns the list of table items. void in case table or scheme is not found
- `insertItemInto(path: string, data: object): object[] | void` - sets the new item by path and return list of all items. void in case table or scheme is not found
- `updateItemInto(path: string, data: object): object[] | void` - updates passed item by path and return list of all items. void in case table or scheme is not found
- `deleteItemInto(path: string, data: object): void` - removes the item by path and data.

## Migrations
You allowed use migrations to easily setup database and seed some data.

To use migrations do:
```
const {Migrate} = require('json-db');
const MyMigration = new Migrate(migrationParams)
MyMigration.migrate()
```

To use seeder do:
```
const {Seeder} = require('json-db');
const MySeeder = new Seeder(seederParams)
MySeeder.seed()
```

### Data instances
- migrationParams:
  ```
    {
        dbPath: string, // path to flder where you want database to be created
        name: string, // name of database to create
        schemes: schemesMigrateParams[]
    }
  ```
- schemesMigrateParams
  ```
    {
        name: string, // name of scheme to create
        tables: tablesMigrateParams[]
    }
  ```
- tablesMigrateParams
  ```
    {
        name: string, // name of table to create
        fields: fieldsMigrateParams[]
    }
  ```
- fieldsMigrateParams
  ```
    {
        name: string, // name of column
        type: string, // column datatype. Must be one of the ['string', 'number', 'boolean']
        primary_key: boolean, // if the field is primary_key. Primary key must be number type only. Must be one primary_key field. Primary key will be autoincremented. Primary key field cannot be nullable
        nullable: boolean // if the field will be null when value is not passed
    }
  ```
- seederParams
    ```
        {
            dbPath: string, // path to folder where databases are hold
            name: string, // database name
            data: seederDataParams[]
        }
    ```
- seederDataParam
    ```
        {
            path: string, // path to table in format '<scheme_name>.<table_name>'
            items: [] // data to put
        }
    ```
