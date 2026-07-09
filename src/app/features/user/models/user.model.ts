import { Permission } from './permission.model';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  permissions: Permission[];
}
