import { TableConfig } from '../../../core/components/ui/data-table/table-config.model';
import { formatDateOnly, formatDateTime } from '../../../core/utils/date-format.utils';
import { User } from '../models/user.model';

export const USER_TABLE_CONFIG: TableConfig<User> = {
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    {
      key: 'permissions',
      label: 'Permissions',
      type: 'chips',
    },
    {
      key: 'createdOn',
      label: 'Created At',
      type: 'date',
      formatter: formatDateOnly,
    },
    {
      key: 'actions',
      label: 'Actions',
      isAction: true,
      actions: [{ label: 'Delete', type: 'delete' }],
    },
  ],
};
