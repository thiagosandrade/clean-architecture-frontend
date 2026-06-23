import { Todo } from './todo.model';

export interface TodoDialogData {
  isEdit: boolean;
  todo?: Todo;
}
