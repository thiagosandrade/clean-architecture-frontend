import {
  Component,
  computed,
  inject,
  Inject,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { firstValueFrom } from 'rxjs';

import { TodoDialogData } from '../../models/todo-dialog-data';
import { TodoItem } from '../../models/todo.model';

import { TodoInfoComponent } from '../todo-info/todo-info';
import { TodoDetailsComponent } from '../todo-details/todo-details';

import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { UnsavedChangesDialogComponent } from '../../../../core/shared/dialogs/unsaved-changes-dialog/unsaved-changes-dialog';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-workspace-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TodoInfoComponent,
    TodoDetailsComponent
  ],
  templateUrl: './todo-workspace-dialog.html',
  styleUrls: ['./todo-workspace-dialog.scss']
})
export class TodoWorkspaceDialogComponent implements OnDestroy {

  @ViewChild(TodoInfoComponent)
  private info?: TodoInfoComponent;

  @ViewChild(TodoDetailsComponent)
  private details?: TodoDetailsComponent;

  private dialog = inject(MatDialog);

  private service = inject(TodoService);

  readonly currentTodo =
    signal<TodoItem | null>(null);

  readonly pendingChanges =
    signal(false);

  readonly taskSwitching =
    signal(false);

  readonly now =
    signal(Date.now());

  currentTitle = '';

  currentIndex = 0;

  leftStatus: WorkspaceStatus = 'none';

  rightStatus: WorkspaceStatus = 'none';

  readonly workspaceStatus = signal<WorkspaceStatus>('none');

  lastSavedAt?: Date;

  private saveTimer?: number;

  constructor(
    private dialogRef: MatDialogRef<TodoWorkspaceDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData
  ) {

    this.currentTodo.set(data.todo);

    this.currentTitle =
      data.todo.description;

    if (data.navigation) {

      const index =
        data.navigation.findIndex(
          x => x.id === data.todo.id
        );

      if (index >= 0) {
        this.currentIndex = index;
      }

    }

  }

  get origin(): string {

    return this.data.origin ?? '';

  }

  get hasUnsavedChanges(): boolean {

    return this.pendingChanges();

  }

  onDescriptionChanged(value: string): void {

    this.currentTitle = value;

  }

  onLeftStatusChanged(
    status: WorkspaceStatus
  ): void {

    this.leftStatus = status;

    this.updatePendingState();

  }

  onRightStatusChanged(
    status: WorkspaceStatus
  ): void {

    this.rightStatus = status;

    this.updatePendingState();

  }

  private updatePendingState(): void {

    let status: WorkspaceStatus = 'none';

    if (this.leftStatus === 'saving' || this.rightStatus === 'saving') {
      status = 'saving';
    }
    else if (this.leftStatus === 'dirty' || this.rightStatus === 'dirty') {
      status = 'dirty';
    }
    else if (this.leftStatus === 'saved' || this.rightStatus === 'saved') {
      status = 'saved';
    }

    this.workspaceStatus.set(status);

    this.pendingChanges.set(status === 'dirty');

    if (status === 'saved') {
      this.lastSavedAt = new Date();
      this.startSaveTimer();
    }
  }

  async onRefresh(): Promise<void> {
    setTimeout(() => {
      void this.reloadCurrentTodo();
    });
  }

  private async reloadCurrentTodo(): Promise<void> {

    const current =
      this.currentTodo();

    if (!current) {
      return;
    }

    const fresh =
      await firstValueFrom(
        this.service.getById(current.id)
      );

    this.currentTodo.set(fresh);

    this.currentTitle =
      fresh.description;

    this.replaceNavigation(fresh);

  }

  private replaceNavigation(
    todo: TodoItem
  ): void {

    if (!this.data.navigation) {
      return;
    }

    this.data.navigation =
      this.data.navigation.map(item =>
        item.id === todo.id
          ? todo
          : item
      );

  }

  close(): void {

    this.confirmBeforeAction(() => {

      this.dialogRef.close({

        refresh: true

      });

    });

  }

  previous(): void {

    if (
      !this.hasPrevious() ||
      this.taskSwitching()
    ) {
      return;
    }

    this.confirmBeforeAction(() => {

      this.currentIndex--;

      this.switchTask();

    });

  }

  next(): void {

    if (
      !this.hasNext() ||
      this.taskSwitching()
    ) {
      return;
    }

    this.confirmBeforeAction(() => {

      this.currentIndex++;

      this.switchTask();

    });

  }

  hasPrevious(): boolean {

    return this.currentIndex > 0;

  }

  hasNext(): boolean {

    return !!this.data.navigation &&
      this.currentIndex <
      this.data.navigation.length - 1;

  }

  private async switchTask(): Promise<void> {

    this.taskSwitching.set(true);

    try {

      const item =
        this.data.navigation![this.currentIndex];

      const todo =
        await firstValueFrom(
          this.service.getById(item.id)
        );

      this.currentTodo.set(todo);

      this.currentTitle =
        todo.description;

      this.resetWorkspace();

    }
    finally {

      this.taskSwitching.set(false);

    }

  }

  backToResults(): void {

    this.confirmBeforeAction(() => {

      this.dialogRef.close({

        action: 'back',

        refresh: true

      });

    });

  }

  private async confirmBeforeAction(
    action: () => void
  ): Promise<void> {

    if (!this.hasUnsavedChanges) {

      action();

      return;

    }

    const ref =
      this.dialog.open(
        UnsavedChangesDialogComponent,
        {
          width: '400px'
        }
      );

    const result =
      await firstValueFrom(
        ref.afterClosed()
      );

    if (result === 'discard') {

      this.clearPendingChanges();

      action();

      return;

    }

    if (result === 'save') {

      await this.saveChanges();

      await this.reloadCurrentTodo();

      this.clearPendingChanges();

      action();

    }

  }

  private async saveChanges(): Promise<void> {

    if (
      this.leftStatus === 'dirty' &&
      this.info
    ) {

      await this.info.save();

    }

    if (
      this.rightStatus === 'dirty' &&
      this.details
    ) {

      await this.details.save();

    }

  }

  private clearPendingChanges(): void {

    this.leftStatus = 'none';

    this.rightStatus = 'none';

    this.workspaceStatus.set('none');

    this.pendingChanges.set(false);

  }

  private resetWorkspace(): void {
    this.leftStatus = 'none';
    this.rightStatus = 'none';
    this.workspaceStatus.set('none');
    this.pendingChanges.set(false);
  }

  private startSaveTimer(): void {

    if (this.saveTimer) {

      clearInterval(this.saveTimer);

    }

    this.now.set(Date.now());

    this.saveTimer =
      window.setInterval(() => {

        this.now.set(Date.now());

      }, 1000);

  }

  readonly saveAge =
    computed(() => {

      if (!this.lastSavedAt) {
        return '';
      }

      this.now();

      const seconds =
        Math.floor(
          (
            this.now() -
            this.lastSavedAt.getTime()
          ) / 1000
        );

      if (seconds < 5) {

        return 'Saved just now';

      }

      if (seconds < 60) {

        return `Saved ${seconds} seconds ago`;

      }

      const minutes =
        Math.floor(seconds / 60);

      return `Saved ${minutes} minute${minutes === 1 ? '' : 's'} ago`;

    });

  ngOnDestroy(): void {

    if (this.saveTimer) {

      clearInterval(this.saveTimer);

    }

  }

}