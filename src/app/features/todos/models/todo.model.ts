export interface Todo {
  id: number;
  userId: number;
  description: string;
  dueDate: string;
  labels: string[];
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
}