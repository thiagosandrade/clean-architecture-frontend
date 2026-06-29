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
import { TodoItem, TodoSubItem } from '../models/todo.model';
import { MatIcon } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";

import { DATE_FORMATS } from '../../../core/constants/date.constants';

@Component({
  selector: 'app-todo-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIcon,
    MatCheckboxModule,
    MatInputModule
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
  saving = false;
  breakingDown = false;

  originalSubItems: TodoItem['subItems'] = [];

  DATE_FORMATS = DATE_FORMATS;
  
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

        this.originalSubItems = structuredClone(todo.subItems);

        this.loading = false;

        this.cdr.detectChanges();

      });

  }

  hasChanges(): boolean {

    return JSON.stringify(this.todo?.subItems) !== JSON.stringify(this.originalSubItems);

  }

  moveUp(index: number) { 

    if (!this.todo || index === 0) {
      return;
    }

    const items = this.todo.subItems;

    [items[index], items[index - 1]] =
      [items[index - 1], items[index]];

    this.recalculateOrder();

  }

  moveDown(index: number) {

    if (!this.todo) {
      return;
    }

    const items = this.todo.subItems;

    if (index >= items.length - 1) {
      return;
    }

    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    this.recalculateOrder();

  }

  private recalculateOrder() {

    this.todo!.subItems.forEach((x, i) => {

      x.order = i + 1;

    });

  }

  toggleCompleted(subtask: TodoItem['subItems'][number]) {

    subtask.isCompleted = !subtask.isCompleted;

  }

  updateDescription(subtask: TodoItem['subItems'][number], value: string) {

    subtask.description = value;

  }

  save() {

    if (!this.todo) {
      return;
    }

    this.saving = true;

    this.service
      .saveSubItems(
        this.todo.id,
        this.todo.subItems
      )
      .subscribe(() => {

        this.load();

        this.saving = false;

      }, () => {

        this.saving = false;

      });

  }

  addSubtask() {

    if (!this.todo) {
      return;
    }


    this.todo.subItems.push({

      id: '00000000-0000-0000-0000-000000000000',
      todoItemId: this.todo.id,
      order: this.todo.subItems.length + 1,
      description: '',
      isCompleted: false,
      completedAt: null,
      createdAt: null
    });

  }

  removeSubtask(index: number) {

    if (!this.todo) {
      return;
    }

    this.todo.subItems.splice(index, 1);

    this.recalculateOrder();

  }

  hasInvalidSubtasks(): boolean {

    return !!this.todo?.subItems.some(
      x => !x.description.trim()
    );

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