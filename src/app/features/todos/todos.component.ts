import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';
import { TODO_TABLE_CONFIG } from './config/todo-table.config';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo/todo-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { DataTableComponent } from '../../core/components/ui/data-table/data-table.component';
import { ParseTodoDialogComponent } from './parse-todo-dialog/parse-todo-dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    DataTableComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];
  tableConfig = TODO_TABLE_CONFIG;
  page = 1;
  size = 10;
  total = 0;
  descending = true;
  searchText = '';
  sortProperty = 'CreatedAt';
  searchControl = new FormControl('');
  hasUserSorted = false;
  resetTableSort = false;

  constructor(
    private service: TodoService,
    private snack: SnackbarService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.searchText = value?.trim() ?? '';

        this.page = 1;

        this.load();
      });

    this.load();
  }

  load() {
    const request = this.searchText?.trim()
      ? this.service.searchTodos(
        this.searchText,
        this.page,
        this.size,
        this.hasUserSorted ? this.sortProperty : '',
        this.descending,
      )
      : this.service.getAll(this.page, this.size, this.sortProperty, this.descending);

    request.subscribe((response) => {
      this.todos = response.items;
      this.total = response.total;
    });
  }

  search() {
    this.page = 1;

    this.load();
  }

  clearSearch() {
    this.searchControl.setValue('', {
      emitEvent: false,
    });

    this.searchText = '';

    this.sortProperty = 'createdAt';

    this.descending = true;

    this.hasUserSorted = false;

    this.resetTableSort = true;

    setTimeout(() => {
      this.resetTableSort = false;
    });

    this.page = 1;

    this.load();
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;

    this.size = event.pageSize;

    this.load();
  }

  onSortChange(sort: Sort) {
    if (!sort.active) {
      return;
    }

    this.sortProperty = sort.active;

    this.hasUserSorted = true;

    this.descending = sort.direction === 'desc';

    this.page = 1;

    this.load();
  }

  createTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '700px',
      data: {
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.service
        .create({
          userId: localStorage.getItem('userId')!,
          description: result.description,
          dueDate: result.dueDate,
          labels: result.labels,
          priority: result.priority,
        })
        .subscribe(() => {
          this.snack.success('Todo created');

          this.load();
        });
    });
  }

  handleAction(event: { action: string; row: Todo }) {
    switch (event.action) {
      case 'delete':
        this.service.delete(event.row.id).subscribe(() => {
          this.snack.success('Deleted');
          this.load();
        });
        break;

      case 'edit':
        {
          const dialogRef = this.dialog.open(TodoDialogComponent, {
            width: '700px',
            data: {
              isEdit: true,
              todo: event.row,
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (!result) {
              return;
            }

            this.service.update(event.row.id, result).subscribe(() => {
              this.snack.success('Todo updated');

              this.load();
            });
          });

          break;
        }
    }
  }

  parseTodo() {

    const dialogRef =
      this.dialog.open(ParseTodoDialogComponent, {
        width: '1300px',
        maxWidth: '95vw'
      });


    dialogRef.afterClosed()
      .subscribe(result => {


        if (!result) {
          return;
        }


        this.service.create({

          userId:
            localStorage.getItem('userId')!,


          description:
            result.description,


          dueDate:
            result.dueDate,


          labels:
            result.labels,


          priority:
            this.mapPriority(result.priority)

        })
          .subscribe(() => {

            this.snack.success(
              'Todo created'
            );

            this.load();

          });
      });
  }

  mapPriority(priority: string) {

    const map: any = {

      Normal: 0,
      Low: 1,
      Medium: 2,
      High: 3,
      Top: 4

    };
    return map[priority] ?? 0;

  }
}
