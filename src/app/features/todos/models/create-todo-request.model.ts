export interface CreateTodoRequest {
  userId: string;
  description: string;
  dueDate: string;
  labels: string[];
  priority: number;
}
