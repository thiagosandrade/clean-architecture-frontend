import { PermissionResponse } from "./permission-response.model";

export interface UserResponse {

  id: string;

  email: string;

  firstName: string;

  lastName: string;

  createdOn: string;

  permissions: PermissionResponse[];

}


