import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TodoItem } from '../../../todos/models/todo.model';
import { Priority } from '../../../../core/enums/priority.enum';

@Component({
  selector: 'app-task-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './task-summary-card.component.html',
  styleUrls: ['./task-summary-card.component.scss']
})
export class TaskSummaryCardComponent {

  @Input()
  task!: TodoItem;

  @Output()
  view = new EventEmitter<TodoItem>();

  get completedSubtasks(): number {

    return this.task.subItems.filter(x => x.isCompleted).length;

  }

  get totalSubtasks(): number {

    return this.task.subItems.length;

  }

  get progress(): number {

    if (this.totalSubtasks === 0) {
      return 0;
    }

    return this.completedSubtasks / this.totalSubtasks * 100;

  }

  get priorityLabel(): string {

    switch (this.task.priority) {

      case Priority.High:
        return 'High';

      case Priority.Normal:
        return 'Normal';

      case Priority.Low:
        return 'Low';

      case Priority.Medium:
        return 'Medium';

      case Priority.Top:
        return 'Top';

      default:
        return 'Unknown';

    }

  }

  get priorityClass(): string {

    switch (this.task.priority) {

      case Priority.High:
        return 'priority-high';

      case Priority.Normal:
        return 'priority-normal';

      case Priority.Low:
        return 'priority-low';

      case Priority.Medium:
        return 'Medium';

      case Priority.Top:
        return 'Top';

      default:
        return '';

    }

  }

}