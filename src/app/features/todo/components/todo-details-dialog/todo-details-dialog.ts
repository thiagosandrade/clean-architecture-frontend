import { Component, Inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { TodoDetailsComponent } from '../todo-details/todo-details';


@Component({
  selector: 'app-todo-details-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TodoDetailsComponent
  ],
  templateUrl: './todo-details-dialog.html',
  styleUrls: ['./todo-details-dialog.scss']
})
export class TodoDetailsDialogComponent {

  hasChanges = false;

  constructor(
    private dialogRef: MatDialogRef<TodoDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string }
  ) { }

  onRefreshRequested(): void {

    this.hasChanges = true;

  }

  close(): void {

    this.dialogRef.close(this.hasChanges);

  }

}