import { Component, Inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { TodoDialogData } from '../todos/models/todo-dialog-data';
import { MatSelectModule } from "@angular/material/select";
import { Priority } from '../../core/enums/priority.enum';
import { enumToOptions } from '../../core/utils/enum.utils';

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule
],
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
})
export class TodoDialogComponent {
  form;
  priorityOptions = enumToOptions(Priority);
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData,
  ) {
    const todo = data.todo;

    this.form = this.fb.group({
      description: [todo?.description ?? '', Validators.required],
      dueDate: [todo?.dueDate ? new Date(todo.dueDate) : null],
      labels: [todo?.labels.join(', ') ?? ''],
      priority: [todo?.priority ?? Priority.Normal],
      isCompleted: [todo?.isCompleted ?? false],
    });
  }

  save() {
    if (this.form.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();

    this.dialogRef.close({
      description: value.description,
      dueDate: value.dueDate ? value.dueDate.toISOString() : null,
      labels:
        value.labels
          ?.split(',')
          .map((x) => x.trim())
          .filter(Boolean) ?? [],
      priority: value.priority ?? 0,
      isCompleted: value.isCompleted,
    });

    this.isSaving = false;
  }
}
