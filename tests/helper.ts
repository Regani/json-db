import { TableInterface, TableDataItem, TableFieldData } from '../src/interfaces';

export const mapWithPrimary = (primaryKeyName: string, items: TableDataItem[]) => {
  let itemIDCounter = 0;

  return items.map((item: TableDataItem) => {
    itemIDCounter += 1;

    return {
      ...item,
      [primaryKeyName]: itemIDCounter,
    };
  });
};

export const getPrimaryKeyName = (fields: TableFieldData[]) => {
  const primaryKey = fields.find((field: TableFieldData) => field.primary_key) as { name: string };

  return primaryKey.name;
};

export const getLastItemWithInvalidId = (Table: TableInterface): TableDataItem => {
  const existingData = Table.getData() as TableDataItem[];
  const primaryKeyName: string = getPrimaryKeyName(Table.getFields());
  const lastItem = existingData[existingData.length - 1];
  const lastItemId = lastItem[primaryKeyName] as number;
  const notExistingId = lastItemId + 1;

  return {
    ...lastItem,
    [primaryKeyName]: notExistingId,
  };
};
