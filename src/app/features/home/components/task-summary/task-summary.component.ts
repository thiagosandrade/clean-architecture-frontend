import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoItem } from '../../../todo/models/todo.model';
import { TaskSummaryCardComponent } from '../task-summary-card/task-summary-card.component';
import { TodoWorkspaceMatchType } from '../../../todo/models/todo-workspace-data';

@Component({
  selector: 'app-task-summary',
  standalone: true,
  imports: [
    CommonModule,
    TaskSummaryCardComponent
  ],
  templateUrl: './task-summary.component.html',
  styleUrls: ['./task-summary.component.scss']
})
export class TaskSummaryComponent {

  @Input()
  tasks: TodoItem[] = [];

  @Input()
  matchType: TodoWorkspaceMatchType = 'normal';

  @Output()
  view = new EventEmitter<TodoItem>();

}