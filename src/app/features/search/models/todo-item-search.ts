export interface TodoItemSearch {
  id: string;
  description: string;
  priority: number;
  dueDate: string | null;
  completed: boolean;
}