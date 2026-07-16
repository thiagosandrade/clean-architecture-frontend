export interface DashboardTask {
  id: string;
  description: string;
  priority: number;
  dueDate: string | null;
  isCompleted: boolean;
  updatedOn: string;
}
