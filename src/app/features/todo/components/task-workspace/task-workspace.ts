import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TaskItem
} from '../../models/todo.model';

import {
  WorkspaceStatus
} from '../../../../core/enums/workspace-status.enum';

import {
  TodoInfoComponent
} from '../todo-info/todo-info';

import {
  TodoDetailsComponent
} from '../todo-details/todo-details';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TaskActivityComponent } from "../../shared/task-activity/task-activity";
import { MatTabsModule } from '@angular/material/tabs';
import { TaskDependenciesComponent } from "../task-dependencies/task-dependencies";


@Component({
  selector: 'app-task-workspace',
  standalone: true,
  imports: [
    CommonModule,
    TodoInfoComponent,
    TodoDetailsComponent,
    MatProgressSpinnerModule,
    TaskActivityComponent,
    MatTabsModule,
    TaskDependenciesComponent
],
  templateUrl: './task-workspace.html',
  styleUrls: [
    './task-workspace.scss'
  ]
})
export class TaskWorkspaceComponent implements OnInit {

  private route = inject(ActivatedRoute);

  private service = inject(TodoService);

  @Input({ required: true })
  todoId?: string;


  @Output()
  workspaceStatusChanged =
    new EventEmitter<WorkspaceStatus>();

  @Output()
  refreshRequested =
    new EventEmitter<void>();


  @Output()
  descriptionChanged =
    new EventEmitter<string>();

  @Output()
  subtasksChanged =
    new EventEmitter<TaskItem['subtasks']>();


  readonly task =  signal<TaskItem | null>(null);

  readonly loading = signal(true);
  
  leftStatus: WorkspaceStatus = 'none';

  rightStatus: WorkspaceStatus = 'none';

  dependencyStatus: WorkspaceStatus = 'none';

  selectedTab = 0;
  async ngOnInit(): Promise<void> {

    const id =
      this.todoId ??
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    await this.loadTask(id);

  }

  async onRefresh(): Promise<void> {

    const task =
      this.task();

    if (!task) {
      return;
    }

    await this.loadTask(task.id);

  }

  private async loadTask(id: string): Promise<void> {

    this.loading.set(true);

    try {

      const task =
        await firstValueFrom(
          this.service.getById(id)
        );

      this.task.set(task);

    }
    finally {

      this.loading.set(false);

    }

  }

  onWorkspaceStatusChanged(status: WorkspaceStatus): void {
    this.workspaceStatusChanged.emit(status);
  }

  onLeftStatusChanged(status: WorkspaceStatus): void {
    this.leftStatus = status;
    this.updateWorkspaceStatus();
  }

  onRightStatusChanged(status: WorkspaceStatus): void {
    this.rightStatus = status;
    this.updateWorkspaceStatus();
  }

  onDependencyStatusChanged(status: WorkspaceStatus): void {
    this.dependencyStatus = status;
    this.updateWorkspaceStatus();
  }

  private updateWorkspaceStatus(): void {

    let status: WorkspaceStatus = 'none';

    if (
      this.leftStatus === 'saving' ||
      this.rightStatus === 'saving' ||
      this.dependencyStatus === 'saving'
    ) {

      status = 'saving';

    } else if (
      this.leftStatus === 'dirty' ||
      this.rightStatus === 'dirty' ||
      this.dependencyStatus === 'dirty'

    ) {

      status = 'dirty';

    } else if (
      this.leftStatus === 'saved' ||
      this.rightStatus === 'saved' ||
      this.dependencyStatus === 'saved'
    ) {

      status = 'saved';

    }

    this.workspaceStatusChanged.emit(status);

  }

}