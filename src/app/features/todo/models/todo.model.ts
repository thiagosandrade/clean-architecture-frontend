import { TodoItemDependency } from "./todoitem-dependency.model";

export interface TodoItem {
  id: string;
  userId: number;
  description: string;
  dueDate: string;
  labels: string[];
  categories: string[];
  isCompleted: boolean;
  createdOn: string | null;
  completedOn: string | null;
  priority: number;
  similarity: number;
  subItems: TodoSubItem[];
  dependencies: TodoItemDependency[];
}

export interface TodoSubItem {
  id: string;
  todoItemId: string;
  description: string;
  isCompleted: boolean;
  createdOn: string | null;
  completedOn: string | null;
  order: number;
}

export interface TodoItemResponse {
  items: TodoItem[];
  total: number;
}

