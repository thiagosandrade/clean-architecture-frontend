import { TaskItem } from './todo.model';

export interface TodoDialogData {
  /**
   * Current todo opened in the dialog/workspace
   */
  todo: TaskItem;

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
  navigation?: TaskItem[];
}
