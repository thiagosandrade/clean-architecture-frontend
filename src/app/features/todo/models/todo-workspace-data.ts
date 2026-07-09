import { TaskItem } from './todo.model';

export type TodoWorkspaceOrigin = 'search' | 'list' | 'direct';

export type TodoWorkspaceMatchType = 'related' | 'possible' | 'normal';

export interface TodoWorkspaceData {
  todo: TaskItem;
  origin?: TodoWorkspaceOrigin;
  matchType?: TodoWorkspaceMatchType;
  navigation?: TaskItem[];
}
