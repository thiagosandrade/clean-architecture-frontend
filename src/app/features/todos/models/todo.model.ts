export interface TodoItem {
  id: string;
  userId: number;
  description: string;
  dueDate: string;
  labels: string[];
  categories: string[];
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
  priority: number;
  subItems: TodoSubItem[];
}

export interface TodoSubItem {
  id: string;
  todoItemId: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
  order: number;
}

export interface TodoResponse {
  items: TodoItem[];
  total: number;
}