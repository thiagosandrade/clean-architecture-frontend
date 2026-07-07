import { TodoItem } from './todo.model';

export type TodoWorkspaceOrigin =
  | 'search'
  | 'list'
  | 'direct';


export type TodoWorkspaceMatchType =
  | 'related'
  | 'possible'
  | 'normal';


export interface TodoWorkspaceData {
  todo: TodoItem;
  origin?: TodoWorkspaceOrigin;
  matchType?: TodoWorkspaceMatchType;
  navigation?: TodoItem[];
}