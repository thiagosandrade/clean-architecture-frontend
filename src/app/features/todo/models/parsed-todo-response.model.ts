export interface ParsedTodo {
  description: string;

  categories: string[] | null;

  labels: string[];

  priority: string;

  dueDate: string;

  userId: string;
}
