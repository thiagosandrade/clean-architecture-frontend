import { Component, computed, Inject, OnDestroy, signal } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { TodoDialogData } from '../../models/todo-dialog-data';
import { TodoDetailsComponent } from '../todo-details/todo-details';
import { TodoInfoComponent } from '../todo-info/todo-info';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";


@Component({
  selector: 'app-todo-workspace-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    TodoInfoComponent,
    TodoDetailsComponent,
    MatIconModule,
    MatProgressSpinnerModule
],
  templateUrl: './todo-workspace-dialog.html',
  styleUrls: ['./todo-workspace-dialog.scss']
})
export class TodoWorkspaceDialogComponent implements OnDestroy {

  hasChanges = signal(false);
  now = signal(Date.now());
  taskSwitching = signal(false);

  currentTitle = '';
  status: WorkspaceStatus = 'none';
  lastSavedAt?: Date;
  currentIndex = 0;
  detailsRefreshTrigger = 0;

  private saveTimer?: number;


  constructor(
    private dialogRef: MatDialogRef<TodoWorkspaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData
  ) {

    this.currentTitle = data.todo?.description || '';

    if (data.navigation) {

      this.currentIndex =
        data.navigation.findIndex(
          x => x.id === data.todo!.id
        );
    }
  }


  onRefresh(): void {
    this.hasChanges.set(true);
    this.detailsRefreshTrigger++;
  }

  close(): void {
    this.dialogRef.close(this.hasChanges());
  }

  onDescriptionChanged(description: string): void {
    this.currentTitle = description;
  }

  onStatusChanged(status: WorkspaceStatus): void {

    this.status = status;

    if (status === 'saved') {

      queueMicrotask(() => {
        this.lastSavedAt = new Date();
        this.startSaveTimer();
      });
    }
  }

  private changeTodo(): void {

    const todo =
      this.data.navigation![this.currentIndex];

    this.data = {
      ...this.data,
      todo
    };

    this.currentTitle = todo.description;

    this.status = 'none';

  }

  previous(): void {

    if (!this.hasPrevious() || this.taskSwitching()) {
      return;
    }

    this.currentIndex--;
    this.switchTask();

  }


  next(): void {

    if (!this.hasNext() || this.taskSwitching()) {
      return;
    }

    this.currentIndex++;
    this.switchTask();

  }

  private switchTask(): void {

    this.taskSwitching.set(true);

    this.changeTodo();

    // allow child components to react to new data
    setTimeout(() => {

      this.taskSwitching.set(false);

    }, 300);

  }

  hasPrevious(): boolean {

    return this.currentIndex > 0;

  }


  hasNext(): boolean {

    return !!this.data.navigation &&
      this.currentIndex <
      this.data.navigation.length - 1;

  }

  backToResults(): void {

    this.dialogRef.close({
      action: 'back',
      refresh: this.hasChanges()
    });

  }
  private startSaveTimer(): void {

    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }

    this.now.set(Date.now());

    this.saveTimer = window.setInterval(() => {
      this.now.set(Date.now());
    }, 1000);

  }

  readonly saveAge = computed(() => {

    if (!this.lastSavedAt) {
      return '';
    }

    // depend on timer signal
    this.now();

    const seconds =
      Math.floor(
        (Date.now() - this.lastSavedAt.getTime()) / 1000);

    if (seconds < 5) {
      return 'Saved just now';
    }

    if (seconds < 60) {
      return `Saved ${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);

    return `Saved ${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  });

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
  }

}