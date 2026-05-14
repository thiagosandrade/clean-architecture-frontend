export type TableColumnType =
  | 'text'
  | 'boolean'
  | 'chips';

export interface TableAction<T> {
  label: string;
  type: 'edit' | 'delete' | string;
}

export interface TableColumn<T> {
  key: Extract<keyof T, string> | 'actions';
  label: string;

  type?: TableColumnType;

  formatter?: (
    value: any,
    row?: T
  ) => string;

  isAction?: boolean;
  actions?: TableAction<T>[];
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
}