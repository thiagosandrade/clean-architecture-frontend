import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { TodoDetailsComponent } from '../../components/todo-details/todo-details';
import { TodoDialogData } from '../../models/todo-dialog-data';


@Component({
  selector: 'app-todo-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TodoDetailsComponent],
  templateUrl: './todo-details-dialog.html',
  styleUrls: ['./todo-details-dialog.scss'],
})
export class TodoDetailsDialogComponent {
  hasChanges = false;

  get taskId(): string {
    return this.data?.todo?.id ?? '';
  }

  constructor(
    private dialogRef: MatDialogRef<TodoDetailsDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData,
  ) {}

  close(): void {
    this.dialogRef.close({
      refresh: this.hasChanges,

      todo: this.data.todo,
    });
  }
}
