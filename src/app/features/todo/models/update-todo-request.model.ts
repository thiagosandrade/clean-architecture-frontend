export interface UpdateTodoRequest {
  userId: string;
  description: string;
  dueDate: string | null;
  labels: string[];
  isCompleted: boolean;
  priority: number;
}
