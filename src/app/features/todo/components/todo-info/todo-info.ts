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

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { firstValueFrom } from 'rxjs';

import { Priority } from '../../../../core/enums/priority.enum';
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';
import { MachineState } from '../../../../core/enums/machine-state.enum';

import { enumToOptions } from '../../../../core/utils/enum.utils';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TodoService } from '../../services/todo.service';
import { TodoItem } from '../../models/todo.model';

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
  ],
  templateUrl: './todo-info.html',
  styleUrls: ['./todo-info.scss'],
})
export class TodoInfoComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  private service = inject(TodoService);

  private snack = inject(SnackbarService);

  @Input({ required: true })
  todo!: TodoItem;

  @Output()
  refreshRequested = new EventEmitter<void>();

  @Output()
  descriptionChanged = new EventEmitter<string>();

  @Output()
  statusChanged = new EventEmitter<WorkspaceStatus>();

  readonly state = signal(MachineState.Ready);

  readonly priorityOptions = enumToOptions(Priority);

  form = this.fb.group({
    description: ['', Validators.required],

    dueDate: [null as Date | null],

    labels: [''],

    priority: [Priority.Normal],

    isCompleted: [false],
  });

  ngOnInit(): void {
    this.form.controls.description.valueChanges.subscribe((value) => {
      if (this.state() !== MachineState.Loading) {
        this.descriptionChanged.emit(value ?? '');
      }
    });

    this.form.valueChanges.subscribe(() => {
      if (this.state() !== MachineState.Saving && this.form.dirty) {
        this.setState(MachineState.Dirty);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['todo'] || !this.todo) {
      return;
    }

    this.setState(MachineState.Loading);

    this.form.patchValue(
      {
        description: this.todo.description,

        dueDate: this.todo.dueDate ? new Date(this.todo.dueDate) : null,

        labels: this.todo.labels?.join(', ') ?? '',

        priority: this.todo.priority,

        isCompleted: this.todo.isCompleted,
      },

      {
        emitEvent: false,
      },
    );

    this.form.markAsPristine();

    this.setState(MachineState.Ready);
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.state() === MachineState.Saving) {
      return;
    }

    this.setState(MachineState.Saving);

    const value = this.form.getRawValue();

    const request = {
      userId: localStorage.getItem('userId') ?? '',

      description: value.description ?? '',

      dueDate: value.dueDate ? value.dueDate.toISOString() : null,

      labels:
        value.labels
          ?.split(',')
          .map((x) => x.trim())
          .filter(Boolean) ?? [],

      priority: value.priority ?? Priority.Normal,

      isCompleted: value.isCompleted ?? false,
    };

    try {
      await firstValueFrom(this.service.update(this.todo.id, request));

      this.form.markAsPristine();

      this.setState(MachineState.Saved);

      this.snack.success('Todo updated');

    } catch {
      this.setState(MachineState.Dirty);
    }
  }

  isSaving(): boolean {
    return this.state() === MachineState.Saving;
  }

  private setState(state: MachineState): void {
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
