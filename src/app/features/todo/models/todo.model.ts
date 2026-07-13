import { TaskDependency } from "./task-dependency";

export interface TaskItem {
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
  similarity: number;
  subtasks: TodoSubtask[];
  dependencies: TaskDependency[];
}

export interface TodoSubtask {
  id: string;
  todoItemId: string;
  description: string;
  isCompleted: boolean;
  createdAt: string | null;
  completedAt: string | null;
  order: number;
}

export interface TodoResponse {
  items: TaskItem[];
  total: number;
}
