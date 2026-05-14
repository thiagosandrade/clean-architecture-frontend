import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';
import { TODO_TABLE_CONFIG } from './config/todo-table.config';
import { DataTableComponent } from '../../core/components/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  todos: Todo[] = [];
  tableConfig = TODO_TABLE_CONFIG;
  page = 1;
  size = 10;
  total = 0;
  propertyName = 'createdAt';
  descending = true;

  constructor(
    private service: TodoService,
    private snack: SnackbarService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll(
      this.page,
      this.size,
      this.propertyName,
      this.descending
    )
    .subscribe(res => {
      this.todos = res.items;
      this.total = res.total;
    });
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

    this.propertyName = sort.active;

    this.descending =
      sort.direction === 'desc';

    this.load();
  }

  handleAction(event: { action: string, row: Todo }) {
    switch (event.action) {

      case 'delete':
        this.service.delete(event.row.id).subscribe(() => {
          this.snack.success('Deleted');
          this.load();
        });
        break;

      case 'edit':
        this.snack.success('Edit clicked (implement dialog)');
        break;
    }
  }
}