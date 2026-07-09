import { Component, Input } from '@angular/core';
import { TaskItem } from '../../../todo/models/todo.model';
import { Priority } from '../../../../core/enums/priority.enum';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-overview',
  imports: [MatCardModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  @Input()
  tasks: TaskItem[] = [];

  get total() {
    return this.tasks.length;
  }

  get completed() {
    return this.tasks.filter((x) => x.isCompleted).length;
  }

  get pending() {
    return this.total - this.completed;
  }

  get topPriority() {
    return this.tasks.filter((x) => x.priority === Priority.Top).length;
  }

  get highPriority() {
    return this.tasks.filter((x) => x.priority === Priority.High).length;
  }

  get mediumPriority() {
    return this.tasks.filter((x) => x.priority === Priority.Medium).length;
  }

  get normalPriority() {
    return this.tasks.filter((x) => x.priority === Priority.Normal).length;
  }

  get lowPriority() {
    return this.tasks.filter((x) => x.priority === Priority.Low).length;
  }

  get overdue() {
    const now = new Date();

    return this.tasks.filter((x) => !x.isCompleted && new Date(x.dueDate) < now).length;
  }
}
