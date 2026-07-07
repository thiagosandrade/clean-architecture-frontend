import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { TodoDialogData } from '../../models/todo-dialog-data';
import { TodoInfoComponent } from "../todo-info/todo-info";

@Component({
  selector: 'app-todo-info-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TodoInfoComponent
],
  templateUrl: './todo-info-dialog.component.html',
  styleUrls: ['./todo-info-dialog.component.scss']
})
export class TodoInfoDialogComponent {

  hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<TodoInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TodoDialogData
  ) { }

  onRefreshRequested(): void {

    this.hasChanges = true;

  }

  close(): void {

    this.dialogRef.close(this.hasChanges);

  }

}