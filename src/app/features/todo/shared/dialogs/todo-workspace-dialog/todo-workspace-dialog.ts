import {
  Component,
  Inject,
  OnDestroy,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner';

import {
  firstValueFrom
} from 'rxjs';

import {
  WorkspaceStatus
} from '../../../../../core/enums/workspace-status.enum';

import {
  TaskItem
} from '../../../models/todo.model';

import {
  TodoDialogData
} from '../../../models/todo-dialog-data';

import {
  TodoService
} from '../../../services/todo.service';

import {
  UnsavedChangesDialogComponent
} from '../unsaved-changes-dialog/unsaved-changes-dialog';

import {
  TaskWorkspaceComponent
} from '../../../components/task-workspace/task-workspace';
import { Router } from '@angular/router';


@Component({
  selector: 'app-todo-workspace-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TaskWorkspaceComponent
  ],
  templateUrl: './todo-workspace-dialog.html',
  styleUrls: ['./todo-workspace-dialog.scss']
})
export class TodoWorkspaceDialogComponent
  implements OnDestroy {


  private dialog =
    inject(MatDialog);


  private service =
    inject(TodoService);

  private router = inject(Router);

  readonly currentTodo =
    signal<TaskItem | null>(null);


  readonly taskSwitching =
    signal(false);


  readonly pendingChanges =
    signal(false);



  readonly now =
    signal(Date.now());



  currentTitle = '';

  currentIndex = 0;


  leftStatus: WorkspaceStatus = 'none';

  rightStatus: WorkspaceStatus = 'none';


  readonly workspaceStatus =
    signal<WorkspaceStatus>('none');


  lastSavedAt?: Date;


  private saveTimer?: number;



  constructor(

    private dialogRef:
      MatDialogRef<TodoWorkspaceDialogComponent>,


    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData

  ) {


    this.currentTodo.set(
      data.todo
    );


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



  onDescriptionChanged(
    value: string
  ): void {

    this.currentTitle = value;

  }


  onWorkspaceStatusChanged(status: WorkspaceStatus): void {

    this.updatePendingState(status);
  }

  private updatePendingState(status: WorkspaceStatus): void {

    if (
      this.leftStatus === 'saving' ||
      this.rightStatus === 'saving'
    ) {

      status = 'saving';

    }
    else if (
      this.leftStatus === 'dirty' ||
      this.rightStatus === 'dirty'
    ) {

      status = 'dirty';

    }
    else if (
      this.leftStatus === 'saved' ||
      this.rightStatus === 'saved'
    ) {

      status = 'saved';

    }


    this.workspaceStatus.set(status);


    this.pendingChanges.set(
      status === 'dirty'
    );


    if (status === 'saved') {

      this.lastSavedAt = new Date();

      this.startSaveTimer();

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

  openFullPage(): void {

    const todo = this.currentTodo();

    if (!todo) {
      return;
    }

    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/tasks',
        todo.id
      ])
    );

    window.open(url, '_blank');

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
      this.currentIndex === 0 ||
      this.taskSwitching()
    ) {
      return;
    }


    this.confirmBeforeAction(() => {

      this.currentIndex--;

      void this.switchTask();

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

      void this.switchTask();

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



  async confirmBeforeAction(
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

    }


  }



  onSubtasksChanged(
    subtasks: TaskItem['subtasks']
  ): void {


    const todo =
      this.currentTodo();


    if (!todo) {

      return;

    }


    this.currentTodo.set({

      ...todo,

      subtasks

    });

  }



  private resetWorkspace(): void {

    this.leftStatus = 'none';

    this.rightStatus = 'none';

    this.workspaceStatus.set('none');

    this.pendingChanges.set(false);

  }



  private clearPendingChanges(): void {

    this.resetWorkspace();

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