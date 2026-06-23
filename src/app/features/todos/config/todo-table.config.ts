import { TableConfig } from '../../../core/components/ui/data-table/table-config.model';
import { Todo } from '../models/todo.model';
import { formatDateTime } from '../../../core/utils/date-format.utils';
import { formatPriority } from '../../../core/utils/priority-format.utils';

export const TODO_TABLE_CONFIG: TableConfig<Todo> = {
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'description', label: 'Description' },

    {
      key: 'isCompleted',
      label: 'Completed',
      type: 'boolean',
    },

    {
      key: 'dueDate',
      label: 'Due Date',
      formatter: formatDateTime,
    },

    {
      key: 'labels',
      label: 'Labels',
      type: 'chips',
    },

    {
      key: 'createdAt',
      label: 'Created At',
      formatter: formatDateTime,
    },

    {
      key: 'completedAt',
      label: 'Completed At',
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
        { label: 'Edit', type: 'edit' },
        { label: 'Delete', type: 'delete' },
      ],
    },
  ],
};
