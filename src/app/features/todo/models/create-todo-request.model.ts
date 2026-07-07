export interface CreateTodoRequest {
  userId: string;
  description: string;
  dueDate: string | null;
  labels: string[];
  priority: number;
}
