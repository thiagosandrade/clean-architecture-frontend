import { PermissionResponse } from './permission-response.model';


export interface ManagePermissionsDialogData {

  userId: string;

  userName: string;

  email: string;

  permissions: PermissionResponse[];

}
