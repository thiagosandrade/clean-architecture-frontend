export interface UpdateTodoItemRequest {
  userId: string;
  description: string;
  dueDate: string | null;
  labels: string[];
  isCompleted: boolean;
  priority: number;
}
