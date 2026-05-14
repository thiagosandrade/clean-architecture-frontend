export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  permissions: Permission[];
}

export interface Permission
{
  id: number;
  userId: string;
  description: string;
}