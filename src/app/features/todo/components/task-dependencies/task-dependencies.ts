import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

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
  MatDialog
} from '@angular/material/dialog';

import {
  firstValueFrom
} from 'rxjs';

import {
  TodoService
} from '../../services/todo.service';

import {
  SnackbarService
} from '../../../../core/services/snackbar.service';

import {
  WorkspaceStatus
} from '../../../../core/enums/workspace-status.enum';

import {
  MachineState
} from '../../../../core/enums/machine-state.enum';

import {
  TaskDependency
} from '../../models/task-dependency.model';

import {
  TaskSearchDialogComponent
} from '../../dialogs/task-search-dialog/task-search-dialog';
import { TaskWorkspaceStore } from '../../stores/task-workspace.store';


@Component({
  selector: 'app-task-dependencies',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-dependencies.html',
  styleUrls: ['./task-dependencies.scss']
})
export class TaskDependenciesComponent
  implements OnInit, OnChanges {

  private readonly workspacestore = inject(TaskWorkspaceStore);

  private readonly service =
    inject(TodoService);


  private readonly snack =
    inject(SnackbarService);


  private readonly dialog =
    inject(MatDialog);



  @Input({ required: true })
  taskId!: string;



  @Output()
  statusChanged =
    new EventEmitter<WorkspaceStatus>();



  readonly state =
    signal(MachineState.Ready);



  readonly dependencies =
    signal<TaskDependency[]>([]);



  private originalDependencies:
    TaskDependency[] = [];



  canSave = false;



  ngOnInit(): void {

    void this.load();

  }



  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['taskId'] &&
      !changes['taskId'].firstChange
    ) {

      void this.load();

    }

  }



  private async load(): Promise<void> {

    if (!this.taskId) {
      return;
    }


    this.setState(
      MachineState.Loading
    );


    const task = this.workspacestore.task()

    if(task == null)
      return;


    const deps =
      task.dependencies ?? [];


    this.dependencies.set(
      structuredClone(deps)
    );


    this.originalDependencies =
      structuredClone(deps);


    this.canSave = false;


    this.setState(
      MachineState.Ready
    );

  }



  async save(): Promise<void> {

    if (
      !this.canSave ||
      this.state() === MachineState.Saving
    ) {
      return;
    }


    this.setState(
      MachineState.Saving
    );


    try {

      await firstValueFrom(

        this.service.updateDependencies(
          this.taskId,
          this.dependencies()
        )

      );

      await this.workspacestore.refresh();

      this.originalDependencies =
        structuredClone(
          this.dependencies()
        );


      this.canSave = false;


      this.setState(
        MachineState.Saved
      );


      this.snack.success(
        'Dependencies updated'
      );


    }
    catch {

      this.setState(
        MachineState.Dirty
      );

    }

  }

  isSaving(): boolean {
    return this.state() === MachineState.Saving;
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
          data: {
            excludeTaskId: this.taskId
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
      this.dependencies()
        .some(
          x =>
            x.dependsOnTodoItemId === selected.id
        );


    if (exists) {

      this.snack.warning(
        'Task is already a dependency'
      );

      return;

    }



    this.dependencies.update(
      items => [

        ...items,

        {
          todoItemId: this.taskId,
          dependsOnTodoItemId: selected.id,
          description: selected.description
        }

      ]
    );


    this.updateState();

  }



  removeDependency(
    index: number
  ): void {


    this.dependencies.update(
      items =>
        items.filter(
          (_, i) => i !== index
        )
    );


    this.updateState();

  }



  private updateState(): void {

    const dirty =
      this.hasChanges();


    this.canSave =
      dirty;


    this.setState(

      dirty
        ? MachineState.Dirty
        : MachineState.Ready

    );

  }



  private hasChanges(): boolean {

    return JSON.stringify(
      this.dependencies()
    )
      !==
      JSON.stringify(
        this.originalDependencies
      );

  }



  private setState(
    state: MachineState
  ): void {


    this.state.set(state);


    switch (state) {

      case MachineState.Dirty:
        this.statusChanged.emit('dirty');
        break;


      case MachineState.Saving:
        this.statusChanged.emit('saving');
        break;


      case MachineState.Saved:
        this.statusChanged.emit('saved');
        break;


      default:
        this.statusChanged.emit('none');

    }

  }



  trackByDependency(
    index: number
  ): string {

    return index.toString();

  }

}