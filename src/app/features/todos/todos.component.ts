import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';
import { TODO_TABLE_CONFIG } from './config/todo-table.config';
import { DataTableComponent } from '../../core/components/ui/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  todos: Todo[] = [];
  tableConfig = TODO_TABLE_CONFIG;

  constructor(
    private service: TodoService,
    private snack: SnackbarService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => this.todos = res);
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