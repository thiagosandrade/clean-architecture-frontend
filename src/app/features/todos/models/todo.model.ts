export interface Todo {
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
}

export interface TodoResponse {
  items: Todo[];
  total: number;
}