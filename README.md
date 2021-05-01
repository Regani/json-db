# JSON-DB
Small library that allows you to work with json files as with database.

## Installation

Using npm:
```shell
$ npm i -g npm
$ npm i json-db
```

# Usage

## Data instances
- path - path to the table `<scheme_name>.<table_name>`

## Working with data
You have access to the following instances:
- DataBase - main instance, group of schemes
- Scheme - group of tables
- Table - like DB table

### DataBase Methods
You have access to the following methods:

- `getSchemes(): string[]` - returns the list of schemes names
- `getScheme(schemeName: string): SchemeInterface | undefined` - return the scheme instance by scheme name. undefined in case scheme is not found
- `getData(path: string): object[] | void` - returns the list of table items. void in case table or scheme is not found
- `insertItemInto(path: string, data: object): object[] | void` - sets the new item by path and return list of all items. void in case table or scheme is not found
- `updateItemInto(path: string, data: object): object[] | void` - updates passed item by path and return list of all items. void in case table or scheme is not found
- `deleteItemInto(path: string, data: object): void` - removes the item by path and data.

## Migrations
[WIP]
