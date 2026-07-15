import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TaskActivityComponent } from "../task-activity/task-activity";
import { MatTabsModule } from '@angular/material/tabs';
import { TaskDependenciesComponent } from "../task-dependencies/task-dependencies";
import { TaskWorkspaceStore } from '../../stores/task-workspace.store';
import { TaskAttachmentsComponent } from '../task-attachments/task-attachments';


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
    TaskDependenciesComponent,
    TaskAttachmentsComponent
  ],
  templateUrl: './task-workspace.html',
  styleUrls: [
    './task-workspace.scss'
  ]
})
export class TaskWorkspaceComponent implements OnInit, OnChanges {

  private route = inject(ActivatedRoute);

  private service = inject(TodoService);

  @Input({ required: true })
  taskId?: string;


  @Output()
  workspaceStatusChanged =
    new EventEmitter<WorkspaceStatus>();

  @Output()
  descriptionChanged =
    new EventEmitter<string>();

  @Output()
  subtasksChanged =
    new EventEmitter<TaskItem['subtasks']>();


  readonly workspacestore =
    inject(TaskWorkspaceStore);

  readonly task =
    this.workspacestore.task;

  readonly loading =
    this.workspacestore.loading;

  leftStatus: WorkspaceStatus = 'none';

  rightStatus: WorkspaceStatus = 'none';

  dependencyStatus: WorkspaceStatus = 'none';

  attachmentStatus: WorkspaceStatus = 'none';

  selectedTab = 0;

  private currentTaskId?: string;

  async ngOnInit(): Promise<void> {

    const id =
      this.taskId ??
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.currentTaskId = id;

    await this.workspacestore.load(id);

  }

  async ngOnChanges(): Promise<void> {

    const id =
      this.taskId ??
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    if (this.currentTaskId === id) {
      return;
    }

    this.currentTaskId = id;

    await this.workspacestore.load(id);

    this.resetWorkspaceStatus();
  }

  private resetWorkspaceStatus(): void {

    this.leftStatus = 'none';
    this.rightStatus = 'none';
    this.dependencyStatus = 'none';

    this.workspaceStatusChanged.emit('none');

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

  onAttachmentStatusChanged(status: WorkspaceStatus): void {
    this.attachmentStatus = status;
    this.updateWorkspaceStatus();
  }

  private updateWorkspaceStatus(): void {

    let status: WorkspaceStatus = 'none';

    if (
      this.leftStatus === 'saving' ||
      this.rightStatus === 'saving' ||
      this.dependencyStatus === 'saving' ||
      this.attachmentStatus === 'saving'
    ) {

      status = 'saving';

    } else if (
      this.leftStatus === 'dirty' ||
      this.rightStatus === 'dirty' ||
      this.dependencyStatus === 'dirty'||
      this.attachmentStatus === 'dirty'

    ) {

      status = 'dirty';

    } else if (
      this.leftStatus === 'saved' ||
      this.rightStatus === 'saved' ||
      this.dependencyStatus === 'saved'||
      this.attachmentStatus === 'saved'
    ) {

      status = 'saved';

    }

    this.workspaceStatusChanged.emit(status);

  }

}