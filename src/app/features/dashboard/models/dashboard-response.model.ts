import { DashboardSummary } from './dashboard-summary.model';
import { DashboardTask } from './dashboard-task.model';

export interface DashboardResponse {
  summary: DashboardSummary;
  recentlyUpdated: DashboardTask[];
  overdue: DashboardTask[];
  highPriority: DashboardTask[];
  dueThisWeek: DashboardTask[];
}
