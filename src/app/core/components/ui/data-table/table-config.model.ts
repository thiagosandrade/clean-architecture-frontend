export type TableColumnType = 'boolean' | 'chips' | 'text' | 'priority' | 'date';

export interface TableAction {
  label: string;
  type: 'view' | 'edit' | 'delete' | string;
}

export interface TableColumn<T> {
  key: Extract<keyof T, string> | 'actions';
  label: string;

  type?: TableColumnType;

  formatter?: (value: unknown, row?: T) => string;

  isAction?: boolean;
  actions?: TableAction[];
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
}
