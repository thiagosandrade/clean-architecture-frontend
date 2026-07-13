import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { firstValueFrom } from 'rxjs';

import { TaskItem } from '../../models/todo.model';

import { TodoService } from '../../services/todo.service';

import { SnackbarService } from '../../../../core/services/snackbar.service';

import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MachineState } from '../../../../core/enums/machine-state.enum';
import { TaskDependency } from '../../models/task-dependency';
import { TaskSearchDialogComponent } from '../../shared/dialogs/task-search-dialog/task-search-dialog';

@Component({
  selector: 'app-task-dependencies',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './task-dependencies.html',
  styleUrls: ['./task-dependencies.scss'],
})
export class TaskDependenciesComponent implements OnChanges {

  private readonly service = inject(TodoService);

  private readonly snack = inject(SnackbarService);

  private readonly dialog = inject(MatDialog);

  @Input({ required: true })
  task!: TaskItem;

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  @Output()
  refreshRequested = new EventEmitter<void>();

  readonly state = signal(MachineState.Ready);

  canSave = false;

  originalDependencies: TaskDependency[] = [];

  ngOnChanges(changes: SimpleChanges): void {

    if (!changes['task'] || !this.task) {
      return;
    }

    this.setState(MachineState.Loading);

    this.originalDependencies =
      structuredClone(this.task.dependencies ?? []);

    this.canSave = false;

    this.setState(MachineState.Ready);

  }

  isSaving(): boolean {

    return this.state() === MachineState.Saving;

  }

  async save(): Promise<void> {

    if (!this.canSave || this.isSaving()) {
      return;
    }

    this.setState(MachineState.Saving);

    try {

      await firstValueFrom(

        this.service.updateDependencies(
          this.task.id,
          this.task.dependencies
        )

      );

      this.originalDependencies =
        structuredClone(this.task.dependencies);

      this.canSave = false;

      this.setState(MachineState.Saved);

      this.snack.success('Dependencies updated');

      this.refreshRequested.emit();

    }
    catch {

      this.setState(MachineState.Dirty);

    }

  }

  async addDependency(): Promise<void> {

    const dialogRef =
      this.dialog.open(
        TaskSearchDialogComponent,
        {
          width: '500px',
          maxHeight: '80vh',
          autoFocus: false,
          restoreFocus: false,
          disableClose: false,
          data: {
            excludeTaskId: this.task.id
          }
        }
      );


    const selected =
      await firstValueFrom(
        dialogRef.afterClosed()
      );


    if (!selected) {
      return;
    }


    const exists =
      this.task.dependencies.some(
        x =>
          x.dependsOnTodoItemId === selected.id
      );


    if (exists) {

      this.snack.warning(
        'Task is already a dependency'
      );

      return;

    }


    this.task.dependencies.push({

      todoItemId: this.task.id,

      dependsOnTodoItemId: selected.id,

      description: selected.description

    });


    this.updateState();

  }

  removeDependency(index: number): void {

    this.task.dependencies.splice(index, 1);

    this.updateState();

  }

  trackByDependency(
    index: number
  ): string {

    return index.toString();

  }

  private updateState(): void {

    const dirty = this.hasChanges();

    this.canSave = dirty;

    this.setState(

      dirty
        ? MachineState.Dirty
        : MachineState.Ready

    );

  }

  private hasChanges(): boolean {

    return JSON.stringify(this.task.dependencies)
      !==
      JSON.stringify(this.originalDependencies);

  }

  private setState(state: MachineState): void {

    this.state.set(state);

    switch (state) {

      case MachineState.Loading:

      case MachineState.Ready:

        this.statusChanged.emit('none');

        break;

      case MachineState.Dirty:

        this.statusChanged.emit('dirty');

        break;

      case MachineState.Saving:

        this.statusChanged.emit('saving');

        break;

      case MachineState.Saved:

        this.statusChanged.emit('saved');

        break;

    }

  }

}