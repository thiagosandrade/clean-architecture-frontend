import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal
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

import { TodoDialogData } from '../../models/todo-dialog-data';
import { Priority } from '../../../../core/enums/priority.enum';
import { WorkspaceStatus } from '../../../../core/enums/workspace-status.enum';

import { enumToOptions } from '../../../../core/utils/enum.utils';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { TodoService } from '../../services/todo.service';
import { MachineState } from '../../../../core/enums/machine-state.enum';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './todo-info.html',
  styleUrls: ['./todo-info.scss']
})
export class TodoInfoComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TodoService);
  private readonly snack = inject(SnackbarService);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true })
  data!: TodoDialogData;

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
    isCompleted: [false]
  });

  ngOnInit(): void {

    this.form.controls.description.valueChanges.subscribe(value => {
      this.descriptionChanged.emit(value ?? '');
    });

    this.form.valueChanges.subscribe(() => {

      if (this.state() !== MachineState.Saving && this.form.dirty) {
        this.setState(MachineState.Dirty);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (!changes['data'] || !this.data?.todo) {
      return;
    }

    const todo = this.data.todo;

    this.form.patchValue({
      description: todo.description,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
      labels: todo.labels?.join(', ') ?? '',
      priority: todo.priority,
      isCompleted: todo.isCompleted
    });

    this.form.markAsPristine();

    this.setState(MachineState.Ready);

  }

  save(): void {

    if (this.form.invalid || this.state() === MachineState.Saving) {
      return;
    }

    this.setState(MachineState.Saving);

    const value = this.form.getRawValue();

    const request = {

      userId: localStorage.getItem('userId') ?? '',
      description: value.description ?? '',
      dueDate: value.dueDate
        ? value.dueDate.toISOString()
        : null,

      labels:
        value.labels
          ?.split(',')
          .map(x => x.trim())
          .filter(Boolean) ?? [],

      priority: value.priority ?? Priority.Normal,
      isCompleted: value.isCompleted ?? false

    };

    const operation =
      this.data.isEdit && this.data.todo
        ? this.service.update(this.data.todo.id, request)
        : this.service.create(request);

    operation.subscribe({

      next: () => {

        this.form.markAsPristine();
        this.refreshRequested.emit();
        this.descriptionChanged.emit(
          value.description ?? ''
        );

        this.snack.success(
          this.data.isEdit
            ? 'Todo updated'
            : 'Todo created'
        );
        this.finishSaving();
      },

      error: () => {
        this.setState(MachineState .Dirty);
        this.cdr.detectChanges();
      }

    });

  }

  onDescriptionChanged(value: string): void {

    this.form.patchValue(
      {
        description: value
      },
      {
        emitEvent: false
      });

    this.descriptionChanged.emit(value);

  }

  isSaving(): boolean {

    return this.state() === MachineState.Saving;

  }

  private finishSaving(): void {

    this.setState(MachineState.Saved);

    this.cdr.detectChanges();

  }

  private setState(state: MachineState): void {

    this.state.set(state);

    switch (state) {

      case MachineState.Ready:
        this.statusChanged.emit('none');
        break;

      case MachineState .Dirty:
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