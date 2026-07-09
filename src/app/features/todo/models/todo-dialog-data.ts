import { TodoItem } from './todo.model';

export interface TodoDialogData {
  /**
   * Current todo opened in the dialog/workspace
   */
  todo: TodoItem;

  /**
   * Optional flag used by create/edit dialogs
   */
  isEdit?: boolean;

  /**
   * Used by workspace when opened from search
   */
  origin?: 'search' | 'list' | string;

  /**
   * Navigation list for previous/next inside workspace
   */
  navigation?: TodoItem[];
}
