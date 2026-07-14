import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { TodoInfoComponent } from '../../components/todo-info/todo-info';
import { TodoDialogData } from '../../models/todo-dialog-data';

@Component({
  selector: 'app-todo-info-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TodoInfoComponent],
  templateUrl: './todo-info-dialog.component.html',
  styleUrls: ['./todo-info-dialog.component.scss'],
})
export class TodoInfoDialogComponent {
  hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<TodoInfoDialogComponent>,

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
