import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';

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
import { TodoService } from '../todos/services/todo.service';
import { SnackbarService } from '../../core/services/snackbar.service';

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
  private cdr = inject(ChangeDetectorRef);

  form;
  priorityOptions = enumToOptions(Priority);
  isSaving: boolean = false;
  needsRefresh = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TodoDialogComponent>,
    private service: TodoService,
    private snack: SnackbarService,
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

    if(this.form.invalid || this.isSaving){
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();

    const request = {

      userId: localStorage.getItem('userId') ?? '',
      description: value.description ?? '',
      dueDate: value.dueDate ? value.dueDate.toISOString() : null,
      labels: value.labels
          ?.split(',')
          .map(x => x.trim())
          .filter(Boolean)
          ?? [],

      priority: value.priority ?? Priority.Normal,
      isCompleted: value.isCompleted ?? false
    };

    if(this.data.isEdit && this.data.todo){

      this.service
        .update(
          this.data.todo.id,
          request
        )
        .subscribe(()=>{

          setTimeout(() => {

            this.isSaving = false;
            this.needsRefresh = true;
            this.cdr.detectChanges();

          });

          this.snack.success(
            'Todo updated'
          );

        },()=>{

            setTimeout(() => {

            this.isSaving = false;
            this.cdr.detectChanges();

          });

        });
    }
    else {

      this.service
        .create(request)
        .subscribe(()=>{

          setTimeout(() => {

            this.isSaving = false;
            this.needsRefresh = true;
            this.cdr.detectChanges();

          });

          this.snack.success(
            'Todo created'
          );

        },()=>{

            setTimeout(() => {

            this.isSaving = false;
            this.cdr.detectChanges();

          });

        });
    }
  }

  close() {

    this.dialogRef.close(this.needsRefresh);

  }
}
