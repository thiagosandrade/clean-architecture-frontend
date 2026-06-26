import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { TodoService } from '../services/todo.service';
import { TodoItem } from '../models/todo.model';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-todo-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIcon
  ],
  templateUrl: './todo-details-dialog.html',
  styleUrls: ['./todo-details-dialog.scss']
})
export class TodoDetailsDialogComponent implements OnInit {

  private service = inject(TodoService);

  private dialogRef =
    inject(MatDialogRef<TodoDetailsDialogComponent>);

  private cdr = inject(ChangeDetectorRef);

  todo?: TodoItem;

  loading = true;

  breakingDown = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string }
  ) { }

  ngOnInit(): void {

    this.load();

  }

  load() {

    this.loading = true;

    this.service
      .getById(this.data.id)
      .subscribe(todo => {

        this.todo = todo;

        this.loading = false;

        this.cdr.detectChanges();

      });

  }

  breakDown() {

    if (!this.todo) {
      return;
    }

    this.breakingDown = true;

    this.service
      .breakdown(this.todo.id)
      .subscribe(() => {

        this.load();

        this.breakingDown = false;

      });

  }

  close() {

    this.dialogRef.close();

  }

  hasSubtasks(): boolean {

    return !!this.todo?.subItems?.length;

  }

}