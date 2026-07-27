import { TableConfig } from '../../../../../core/components/ui/data-table/table-config.model';
import { formatDateOnly, formatDateTime } from '../../../../../core/utils/date-format.utils';
import { formatPriority } from '../../../../../core/utils/priority-format.utils';
import { TodoItem } from '../../../models/todo.model';

export const TODO_TABLE_CONFIG: TableConfig<TodoItem> = {
  columns: [
    // { key: 'id', label: 'ID' },
    { key: 'description', label: 'Description' },

    {
      key: 'isCompleted',
      label: 'Completed',
      type: 'boolean',
    },

    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'date',
      formatter: formatDateOnly,
    },

    {
      key: 'labels',
      label: 'Labels',
      type: 'chips',
    },

    {
      key: 'categories',
      label: 'Categories',
      type: 'chips',
    },

    {
      key: 'createdOn',
      label: 'Created On',
      type: 'date',
      formatter: formatDateTime,
    },

    {
      key: 'completedOn',
      label: 'Completed On',
      type: 'date',
      formatter: formatDateTime,
    },

    {
      key: 'priority',
      label: 'Priority',
      type: 'priority',
      formatter: formatPriority,
    },

    {
      key: 'actions',
      label: 'Actions',
      isAction: true,
      actions: [
        { label: 'View', type: 'view' },
        { label: 'Edit', type: 'edit' },
        { label: 'Delete', type: 'delete' },
      ],
    },
  ],
};
