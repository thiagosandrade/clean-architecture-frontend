import { UserResponse } from "./user-response.model";

export interface UserFormDialogData {
  mode: 'create' | 'edit';
  user?: UserResponse;
}