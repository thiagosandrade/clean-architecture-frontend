import { TodoItem } from './todo.model';

export interface TodoDialogData {
  isEdit: boolean;
  todo?: TodoItem;
}
