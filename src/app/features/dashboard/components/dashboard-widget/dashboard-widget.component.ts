import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTask } from '../../models/dashboard-task.model';
import { formatDateOnly } from '../../../../core/utils/date-format.utils';
import { formatPriority } from '../../../../core/utils/priority-format.utils';

@Component({
  selector: 'app-dashboard-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss'],
})
export class DashboardWidgetComponent {
  @Input() title = '';
  @Input() tasks: DashboardTask[] = [];

  formatDateOnly = formatDateOnly;
  formatPriority = formatPriority;
}
