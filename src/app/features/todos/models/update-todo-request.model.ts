export interface UpdateTodoRequest {
  userId: string;
  description: string;
  dueDate: string;
  labels: string[];
  isCompleted: boolean;
  priority: number;
}
