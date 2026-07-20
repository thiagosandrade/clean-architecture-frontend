import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { Priority } from '../../../../core/enums/priority.enum';
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MachineState } from '../../../../core/enums/machine-state.enum';

import { enumToOptions } from '../../../../core/utils/enum.utils';

import { SnackbarService } from '../../../../core/services/snackbar.service';

import { TodoService } from '../../services/todo.service';

import { TodoItem } from '../../models/todo.model';

import { TodoRewriteDialogComponent } from '../../dialogs/todo-rewrite-dialog/todo-rewrite-dialog';

import { TaskWorkspaceStore } from '../../stores/task-workspace.store';

@Component({
  selector: 'app-todo-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './todo-info.html',
  styleUrls: ['./todo-info.scss'],
})
export class TodoInfoComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);

  private readonly service = inject(TodoService);

  private readonly workspaceStore =
    inject(TaskWorkspaceStore);

  private readonly snack =
    inject(SnackbarService);

  private readonly dialog =
    inject(MatDialog);

  @Input()
  mode: 'create' | 'edit' | 'view' = 'create';

  @Input()
  taskId?: string;

  @Output()
  created = new EventEmitter<string>();

  @Output()
  descriptionChanged = new EventEmitter<string>();

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  todo!: TodoItem;

  readonly state =
    signal(MachineState.Ready);

  readonly priorityOptions =
    enumToOptions(Priority);

  private originalValue:
    ReturnType<typeof this.form.getRawValue> | null = null;

  private currentTodoId?: string;

  form = this.fb.group({

    description: [
      '',
      Validators.required
    ],

    dueDate: [
      null as Date | null
    ],

    labels: [
      ''
    ],

    priority: [
      Priority.Normal
    ],

    isCompleted: [
      false
    ]

  });

  ngOnInit(): void {

    this.form.controls.description.valueChanges.subscribe(value => {

      if (this.state() !== MachineState.Loading) {

        this.descriptionChanged.emit(value ?? '');

      }

    });

    this.form.valueChanges.subscribe(() => {

      if (this.state() === MachineState.Loading) {

        return;

      }

      const changed =
        this.hasChanges();

      if (!changed) {

        this.form.markAsPristine();

      }

      this.setState(

        changed
          ? MachineState.Dirty
          : MachineState.Ready

      );

    });

  }

  async ngOnChanges(
    changes: SimpleChanges
  ): Promise<void> {

    console.log(this.mode)
    console.log(this.taskId)
    if (this.mode === 'create') {

      this.initializeCreate();

      return;

    }

    if (!changes['taskId']) {
      console.log('!changes[]')
      return;

    }

    if (!this.taskId) {
      console.log('!this.taskId')
      return;

    }

    if (this.currentTodoId === this.taskId) {
      console.log('this.currentTodoId === this.taskId')

      return;

    }

    this.currentTodoId = this.taskId;

    await this.load();
  }

  isRewriteDisabled(): boolean {
    return this.mode === 'create';
  }

  private initializeCreate(): void {

    this.todo = {} as TodoItem;

    this.form.reset({

      description: '',

      dueDate: null,

      labels: '',

      priority: Priority.Normal,

      isCompleted: false

    }, {

      emitEvent: false

    });

    this.originalValue =
      structuredClone(
        this.form.getRawValue()
      );

    this.form.markAsPristine();

    this.setState(
      MachineState.Ready
    );

  }

  private async load(): Promise<void> {

    this.setState(MachineState.Loading);

    try {

      const task = await this.workspaceStore.load(this.taskId!);

      if (!task) {
        return;
      }

      this.todo = task;

      this.form.patchValue({

        description: task.description,

        dueDate: task.dueDate
          ? new Date(task.dueDate)
          : null,

        labels: task.labels?.join(', ') ?? '',

        priority: task.priority,

        isCompleted: task.isCompleted

      }, {

        emitEvent: false

      });

      this.originalValue =
        structuredClone(
          this.form.getRawValue()
        );

      this.form.markAsPristine();

    }
    finally {

      this.setState(MachineState.Ready);

    }

  }

  async save(): Promise<void> {

    if (this.form.invalid) {

      return;

    }

    if (this.state() === MachineState.Saving) {

      return;

    }

    this.setState(
      MachineState.Saving
    );

    try {

      if (this.mode === 'create') {

        await this.create();

      }
      else {

        await this.update();

      }

      this.originalValue =
        structuredClone(
          this.form.getRawValue()
        );

      this.form.markAsPristine();

      this.setState(
        MachineState.Saved
      );

    }
    catch {

      this.setState(
        MachineState.Dirty
      );

    }

  }

  private async create(): Promise<void> {

    const value =
      this.form.getRawValue();

    const request = {

      userId:
        localStorage.getItem('userId') ?? '',

      description:
        value.description ?? '',

      dueDate:
        value.dueDate
          ? value.dueDate.toISOString()
          : null,

      labels:
        value.labels
          ?.split(',')
          .map(x => x.trim())
          .filter(Boolean) ?? [],

      priority:
        value.priority ?? Priority.Normal,

      isCompleted:
        false

    };

    const todoId =
      await firstValueFrom(

        this.service.create(request)

      );

    this.snack.success(
      'Task created'
    );

    this.created.emit(todoId);

  }

  private async update(): Promise<void> {

    const value =
      this.form.getRawValue();

    const request = {

      userId:
        localStorage.getItem('userId') ?? '',

      description:
        value.description ?? '',

      dueDate:
        value.dueDate
          ? value.dueDate.toISOString()
          : null,

      labels:
        value.labels
          ?.split(',')
          .map(x => x.trim())
          .filter(Boolean) ?? [],

      priority:
        value.priority ?? Priority.Normal,

      isCompleted:
        value.isCompleted ?? false

    };

    await firstValueFrom(

      this.service.update(
        this.todo.id,
        request
      )

    );

    await this.workspaceStore.refresh();

    this.snack.success(
      'Task updated'
    );

  }

  hasChanges(): boolean {

    return JSON.stringify(
      this.form.getRawValue()
    ) !== JSON.stringify(
      this.originalValue
    );

  }

  async rewrite(): Promise<void> {

    const dialogRef =
      this.dialog.open(
        TodoRewriteDialogComponent,
        {
          width: '650px',
          data: {
            id: this.todo?.id,
            description:
              this.form.controls.description.value ?? ''
          }
        });

    const result =
      await firstValueFrom(
        dialogRef.afterClosed()
      );

    if (!result?.description) {

      return;

    }

    this.form.controls.description.setValue(
      result.description
    );

    this.descriptionChanged.emit(
      result.description
    );

  }

  isSaving(): boolean {

    return this.state() === MachineState.Saving;

  }

  private setState(
    state: MachineState
  ): void {

    this.state.set(state);

    switch (state) {

      case MachineState.Loading:

        this.statusChanged.emit('none');

        break;

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