import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoItem } from '../../../todos/models/todo.model';
import { TaskSummaryCardComponent } from '../task-summary-card/task-summary-card.component';

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

  @Output()
  view = new EventEmitter<TodoItem>();

}